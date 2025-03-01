import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import axios from 'axios';
import { config } from '../config/config';

export class InventoryController {
    private readonly breweryApiUrl = config.breweryApiUrl;
    
    public async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const response = await axios.post(`${this.breweryApiUrl}/api/inventory`, req.body); 
            res.status(201).json(response.data);
        } catch (error: any) {
            console.error("Error adding product:", error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                message: error.response?.data?.message || "Error adding product",
                error: error.response?.data?.error || error.response?.data?.errors || error.message
            });
        }
    }

    public async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await axios.get(`${this.breweryApiUrl}/api/inventory/${req.params.id}`);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error("Error fetching product:", error.response?.data || error.message);
            res.status(error.response?.status || 404).json({ message: error.response?.data?.message || "Product not found" });
        }
    }

    public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await axios.put(`${this.breweryApiUrl}/api/inventory/${req.params.id}`, req.body);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error("Error updating product:", error.response?.data || error.message);
            res.status(error.response?.status || 404).json({ message: error.response?.data?.message || "Product not found" });
        }
    }

    public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await axios.delete(`${this.breweryApiUrl}/api/inventory/${req.params.id}`);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error("Error deleting product:", error.response?.data || error.message);
            res.status(error.response?.status || 404).json({ message: error.response?.data?.message || "Product not found" });
        }
    }

    public async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await axios.get(`${this.breweryApiUrl}/api/inventory`);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error("Error fetching products:", error.response?.data || error.message);
            res.status(error.response?.status || 500).json({ message: error.response?.data?.message || "Error fetching products" });
        }
    }
}