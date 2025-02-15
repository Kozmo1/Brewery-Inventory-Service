import { Request, Response, NextFunction } from 'express';
import { Inventory } from '../infrastructure/mongodb/models/inventory';
import { validationResult } from 'express-validator';

export class InventoryController {
    
    public async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const inventory = new Inventory(req.body);
            await inventory.save();
            res.status(201).json({ message: 'Product added successfully', inventoryId: inventory._id });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ message: 'Error adding product' });
        }
    }

    public async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const inventory = await Inventory.findById(req.params.id);
            if (inventory) {
                res.status(200).json(inventory);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Error fetching product' });
        }
    }

    public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (inventory) {
                res.status(200).json(inventory);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Error updating product' });
        }
    }

    public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const inventory = await Inventory.findByIdAndDelete(req.params.id);
            if (inventory) {
                res.status(200).json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Error deleting product' });
        }
    }

    public async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const inventory = await Inventory.find();
            res.status(200).json(inventory);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    }
}