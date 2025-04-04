import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import axios from "axios";
import { config } from "../config/config";
import { AuthRequest } from "../middleware/auth";

export interface Inventory {
	id: number;
	name: string;
	type: string;
	description: string;
	abv: number;
	volume: number;
	package: string;
	price: number;
	cost: number;
	stockQuantity: number;
	reorderPoint: number;
	tasteProfile: {
		primaryFlavor?: string | null;
		sweetness?: string | null;
		bitterness?: string | null;
	};
}

export class InventoryController {
	private readonly breweryApiUrl = config.breweryApiUrl;

	async addProduct(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		try {
			const response = await axios.post(
				`${this.breweryApiUrl}/api/inventory`,
				req.body,
				{ headers: { Authorization: req.headers.authorization } }
			);
			res.status(201).json(response.data);
		} catch (error: any) {
			console.error(
				"Error adding product:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message || "Error adding product",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	async getProductById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const response = await axios.get(
				`${this.breweryApiUrl}/api/inventory/${req.params.id}`,
				{ headers: { Authorization: req.headers.authorization } }
			);
			res.status(200).json(response.data);
		} catch (error: any) {
			console.error(
				"Error fetching product:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 404).json({
				message: error.response?.data?.message || "Product not found",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	async updateProduct(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const response = await axios.put(
				`${this.breweryApiUrl}/api/inventory/${req.params.id}`,
				req.body,
				{ headers: { Authorization: req.headers.authorization } }
			);
			res.status(200).json(response.data);
		} catch (error: any) {
			console.error(
				"Error updating product:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 404).json({
				message: error.response?.data?.message || "Product not found",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	async deleteProduct(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			await axios.delete(
				`${this.breweryApiUrl}/api/inventory/${req.params.id}`,
				{ headers: { Authorization: req.headers.authorization } }
			);
			res.status(200).json({ message: "Product deleted successfully" });
		} catch (error: any) {
			console.error(
				"Error deleting product:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 404).json({
				message: error.response?.data?.message || "Product not found",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	async getAllProducts(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const response = await axios.get(
				`${this.breweryApiUrl}/api/inventory`
			);
			res.status(200).json(response.data);
		} catch (error: any) {
			console.error(
				"Error fetching products:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message || "Error fetching products",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	async updateStock(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		try {
			const response = await axios.put<Inventory>(
				`${this.breweryApiUrl}/api/inventory/${req.params.id}/stock`,
				{ Quantity: req.body.quantity },
				{ headers: { Authorization: req.headers.authorization } }
			);
			const product: Inventory = response.data;
			res.status(200).json({
				message: "Stock updated successfully",
				product,
			});
		} catch (error: any) {
			console.error(
				"Error updating stock:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message || "Error updating stock",
				error: error.response?.data?.errors || error.message,
			});
		}
	}
}
