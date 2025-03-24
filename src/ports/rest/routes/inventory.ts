import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { InventoryController } from "../../../controllers/inventoryController";
import { verifyToken, AuthRequest } from "../../../middleware/auth";

const router = express.Router();
const inventoryController = new InventoryController();

router.post(
	"/add-product",
	verifyToken,
	body("name").notEmpty().withMessage("Name is required"),
	body("type")
		.isIn(["Beer", "Cocktail", "Liqueur", "Hard Seltzer"])
		.withMessage("Invalid product type"),
	body("description").notEmpty().withMessage("Description is required"),
	body("abv")
		.isFloat({ min: 0 })
		.withMessage("ABV must be a positive number"),
	body("volume")
		.isFloat({ min: 0 })
		.withMessage("Volume must be a positive number"),
	body("package").isIn(["Can", "Bottle"]).withMessage("Invalid package type"),
	body("price")
		.isFloat({ min: 0 })
		.withMessage("Price must be a positive number"),
	body("cost")
		.isFloat({ min: 0 })
		.withMessage("Cost must be a positive number"),
	body("stockQuantity")
		.isInt({ min: 0 })
		.withMessage("Stock quantity must be a non-negative integer"),
	body("reorderPoint")
		.isInt({ min: 0 })
		.withMessage("Reorder point must be a non-negative integer"),
	(req: AuthRequest, res: Response, next: NextFunction) =>
		inventoryController.addProduct(req, res, next)
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
	inventoryController.getProductById(req, res, next)
);

router.put(
	"/:id",
	verifyToken,
	(req: Request, res: Response, next: NextFunction) =>
		inventoryController.updateProduct(req, res, next)
);

router.delete(
	"/:id",
	verifyToken,
	(req: Request, res: Response, next: NextFunction) =>
		inventoryController.deleteProduct(req, res, next)
);

router.get("/", (req: Request, res: Response, next: NextFunction) =>
	inventoryController.getAllProducts(req, res, next)
);

router.put(
	"/:id/stock",
	verifyToken,
	body("quantity").isInt().withMessage("Quantity must be an integer"),
	(req: AuthRequest, res: Response, next: NextFunction) =>
		inventoryController.updateStock(req, res, next)
);

export = router;
