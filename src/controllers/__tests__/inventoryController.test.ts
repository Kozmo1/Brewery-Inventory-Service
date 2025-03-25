import { InventoryController } from "../inventoryController";
import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import axios from "axios";
import { validationResult, ValidationError } from "express-validator";

// Mock axios for API calls
jest.mock("axios", () => ({
	post: jest.fn(),
	get: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
}));

// Mock express-validator
jest.mock("express-validator", () => ({
	validationResult: jest.fn(),
}));

// Type the mocked validationResult
const mockedValidationResult =
	validationResult as unknown as jest.MockedFunction<
		() => {
			isEmpty: () => boolean;
			array: () => ValidationError[];
		}
	>;

describe("InventoryController", () => {
	let inventoryController: InventoryController;
	let mockRequest: Partial<AuthRequest>;
	let mockResponse: Partial<Response>;
	let mockNext: jest.Mock;

	// Set up fresh controller and mocks before each test
	beforeEach(() => {
		inventoryController = new InventoryController();
		mockRequest = {
			body: {},
			params: {},
			headers: { authorization: "Bearer mock-token" },
			user: { id: 1, email: "test@example.com" },
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		mockNext = jest.fn();

		// Clear mocks to keep things clean
		jest.clearAllMocks();
		// Keep console logs quiet during tests
		jest.spyOn(console, "error").mockImplementation(() => {});
	});

	describe("addProduct", () => {
		// Test adding a product successfully
		it("should add a product successfully", async () => {
			// Mock validation passing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});
			// Mock API response
			(axios.post as jest.Mock).mockResolvedValue({
				data: { id: 1, name: "Beer" },
			});

			mockRequest.body = { name: "Beer", type: "Beer" };

			await inventoryController.addProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Check the API call
			expect(axios.post).toHaveBeenCalledWith(
				"http://localhost:5089/api/inventory",
				{ name: "Beer", type: "Beer" },
				expect.any(Object)
			);
			// Expect the success response
			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalledWith({
				id: 1,
				name: "Beer",
			});
		});

		// Test validation failure
		it("should return 400 if validation fails", async () => {
			// Mock validation failing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => false,
				array: () => [{ msg: "Name is required" } as ValidationError],
			});

			mockRequest.body = { type: "Beer" }; // Missing name

			await inventoryController.addProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the error response
			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				errors: [{ msg: "Name is required" }],
			});
		});

		// Test API error
		it("should handle API error", async () => {
			// Mock validation passing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});
			// Mock an API error
			(axios.post as jest.Mock).mockRejectedValue({
				response: { status: 400, data: { message: "Bad request" } },
			});

			mockRequest.body = { name: "Beer", type: "Beer" };

			await inventoryController.addProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Check the error response
			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Bad request",
				error: undefined,
			});
		});

		// Test error without response
		it("should handle error without response", async () => {
			// Mock validation passing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});
			// Mock a generic error
			(axios.post as jest.Mock).mockRejectedValue(
				new Error("Network error")
			);

			mockRequest.body = { name: "Beer", type: "Beer" };

			await inventoryController.addProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the fallback error response
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Error adding product",
				error: "Network error",
			});
		});
	});

	describe("getProductById", () => {
		// Test fetching a product successfully
		it("should get product by ID successfully", async () => {
			// Mock API response
			(axios.get as jest.Mock).mockResolvedValue({
				data: { id: 1, name: "Beer" },
			});

			mockRequest.params = { id: "1" };

			await inventoryController.getProductById(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			// Check the API call
			expect(axios.get).toHaveBeenCalledWith(
				"http://localhost:5089/api/inventory/1",
				expect.any(Object)
			);
			// Expect the success response
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				id: 1,
				name: "Beer",
			});
		});

		// Test product not found
		it("should handle product not found", async () => {
			// Mock an API error
			(axios.get as jest.Mock).mockRejectedValue({
				response: {
					status: 404,
					data: { message: "Product not found" },
				},
			});

			mockRequest.params = { id: "1" };

			await inventoryController.getProductById(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			// Expect the error response
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Product not found",
				error: undefined,
			});
		});

		// Test error without response
		it("should handle error without response", async () => {
			// Mock a generic error
			(axios.get as jest.Mock).mockRejectedValue(
				new Error("Network error")
			);

			mockRequest.params = { id: "1" };

			await inventoryController.getProductById(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			// Expect the fallback error response
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Product not found",
				error: "Network error",
			});
		});
	});

	describe("updateProduct", () => {
		// Test updating a product successfully
		it("should update product successfully", async () => {
			// Mock API response
			(axios.put as jest.Mock).mockResolvedValue({
				data: { id: 1, name: "Updated Beer" },
			});

			mockRequest.params = { id: "1" };
			mockRequest.body = { name: "Updated Beer" };

			await inventoryController.updateProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Check the API call
			expect(axios.put).toHaveBeenCalledWith(
				"http://localhost:5089/api/inventory/1",
				{ name: "Updated Beer" },
				expect.any(Object)
			);
			// Expect the success response
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				id: 1,
				name: "Updated Beer",
			});
		});

		// Test product not found
		it("should handle product not found", async () => {
			// Mock an API error
			(axios.put as jest.Mock).mockRejectedValue({
				response: {
					status: 404,
					data: { message: "Product not found" },
				},
			});

			mockRequest.params = { id: "1" };
			mockRequest.body = { name: "Updated Beer" };

			await inventoryController.updateProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the error response
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Product not found",
				error: undefined,
			});
		});

		// Test error without response
		it("should handle error without response", async () => {
			// Mock a generic error
			(axios.put as jest.Mock).mockRejectedValue(
				new Error("Network error")
			);

			mockRequest.params = { id: "1" };
			mockRequest.body = { name: "Updated Beer" };

			await inventoryController.updateProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the fallback error response
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Product not found",
				error: "Network error",
			});
		});
	});

	describe("deleteProduct", () => {
		// Test deleting a product successfully
		it("should delete product successfully", async () => {
			// Mock API response
			(axios.delete as jest.Mock).mockResolvedValue({});

			mockRequest.params = { id: "1" };

			await inventoryController.deleteProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Check the API call
			expect(axios.delete).toHaveBeenCalledWith(
				"http://localhost:5089/api/inventory/1",
				expect.any(Object)
			);
			// Expect the success response
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Product deleted successfully",
			});
		});

		// Test product not found
		it("should handle product not found", async () => {
			// Mock an API error
			(axios.delete as jest.Mock).mockRejectedValue({
				response: {
					status: 404,
					data: { message: "Product not found" },
				},
			});

			mockRequest.params = { id: "1" };

			await inventoryController.deleteProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the error response
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Product not found",
				error: undefined,
			});
		});

		// Test error without response
		it("should handle error without response", async () => {
			// Mock a generic error
			(axios.delete as jest.Mock).mockRejectedValue(
				new Error("Network error")
			);

			mockRequest.params = { id: "1" };

			await inventoryController.deleteProduct(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the fallback error response
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Product not found",
				error: "Network error",
			});
		});
	});

	describe("getAllProducts", () => {
		// Test fetching all products successfully
		it("should get all products successfully", async () => {
			// Mock API response
			(axios.get as jest.Mock).mockResolvedValue({
				data: [
					{ id: 1, name: "Beer" },
					{ id: 2, name: "Ale" },
				],
			});

			await inventoryController.getAllProducts(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			// Check the API call
			expect(axios.get).toHaveBeenCalledWith(
				"http://localhost:5089/api/inventory"
			);
			// Expect the success response
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith([
				{ id: 1, name: "Beer" },
				{ id: 2, name: "Ale" },
			]);
		});

		// Test error fetching products
		it("should handle error fetching products", async () => {
			// Mock an API error
			(axios.get as jest.Mock).mockRejectedValue({
				response: { status: 500, data: { message: "Server error" } },
			});

			await inventoryController.getAllProducts(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			// Expect the error response
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Server error",
				error: undefined,
			});
		});

		// Test error without response
		it("should handle error without response", async () => {
			// Mock a generic error
			(axios.get as jest.Mock).mockRejectedValue(
				new Error("Network error")
			);

			await inventoryController.getAllProducts(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			// Expect the fallback error response
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Error fetching products",
				error: "Network error",
			});
		});
	});

	describe("updateStock", () => {
		// Test updating stock successfully
		it("should update stock successfully", async () => {
			// Mock validation passing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});
			// Mock API response
			(axios.put as jest.Mock).mockResolvedValue({
				data: { id: 1, name: "Beer", stockQuantity: 20 },
			});

			mockRequest.params = { id: "1" };
			mockRequest.body = { quantity: 10 };

			await inventoryController.updateStock(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Check the API call
			expect(axios.put).toHaveBeenCalledWith(
				"http://localhost:5089/api/inventory/1/stock",
				{ Quantity: 10 },
				expect.any(Object)
			);
			// Expect the success response
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Stock updated successfully",
				product: { id: 1, name: "Beer", stockQuantity: 20 },
			});
		});

		// Test validation failure
		it("should return 400 if validation fails", async () => {
			// Mock validation failing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => false,
				array: () => [
					{ msg: "Quantity must be an integer" } as ValidationError,
				],
			});

			mockRequest.params = { id: "1" };
			mockRequest.body = { quantity: "invalid" };

			await inventoryController.updateStock(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the error response
			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				errors: [{ msg: "Quantity must be an integer" }],
			});
		});

		// Test API error
		it("should handle API error", async () => {
			// Mock validation passing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});
			// Mock an API error
			(axios.put as jest.Mock).mockRejectedValue({
				response: { status: 400, data: { message: "Bad request" } },
			});

			mockRequest.params = { id: "1" };
			mockRequest.body = { quantity: 10 };

			await inventoryController.updateStock(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the error response
			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Bad request",
				error: undefined,
			});
		});

		// Test error without response
		it("should handle error without response", async () => {
			// Mock validation passing
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});
			// Mock a generic error
			(axios.put as jest.Mock).mockRejectedValue(
				new Error("Network error")
			);

			mockRequest.params = { id: "1" };
			mockRequest.body = { quantity: 10 };

			await inventoryController.updateStock(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			// Expect the fallback error response
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Error updating stock",
				error: "Network error",
			});
		});
	});
});
