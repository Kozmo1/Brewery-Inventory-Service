import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {Inventory} from '../../../infrastructure/mongodb/models/inventory';
import { ConnectToDb } from '../../../infrastructure/mongodb/connection';

const router = express.Router();

ConnectToDb();

router.post('/inventory/add-product',
    body('name').notEmpty().withMessage('A Name is required'),
    body('type').isIn(['Beer', 'Cocktail', 'Liqueuer', 'Hard Seltzer']).withMessage('Invalid product type'),
    body('description').notEmpty().withMessage('A description is required'),
    body('abv').isFloat({min: 0}).withMessage('ABV must be a number greater or equal to 0'),
    body('volume').isFloat({min: 0}).withMessage('Volume must be a number greater or equal to 0'),
    body('package').isIn(['Can', 'Bottle']).withMessage('Invalid package type'),
    body('price').isFloat({min: 0}).withMessage('Price must be a number greater or equal to 0'),
    body('cost').isFloat({min: 0}).withMessage('Cost must be a number greater or equal to 0'),
    body('stockQuantity').isInt({min: 0}).withMessage('Stock quantity must be a number greater or equal to 0'),
    body('reorderPoint').isInt({min: 0}).withMessage('Reorder point must be a number greater or equal to 0'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean'),
    body('tasteProfile').isObject().withMessage('Taste profile must be an object'),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const inventory = new Inventory(req.body);
            await inventory.save();
            res.status(201).json({message: 'Product added successfully', inventoryId: inventory._id});
        } catch (error) {
            console.error('Error adding product', error);
            res.status(500).json({message: 'Error adding product'});
        }
});

router.get('/inventory/:id', async (req: Request, res: Response) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (inventory) {
            res.status(200).json(inventory);
        } else {
            res.status(404).json({message: 'Product not found'});
        }
    } catch (error) {
        console.error('Error getting product', error);
        res.status(500).json({message: 'Error getting product'});
    }
});

router.put('/inventory/:id', async (req: Request, res: Response) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (inventory) {
            res.status(200).json(inventory);
        } else {
            res.status(404).json({message: 'Product not found'});
        }
    } catch (error) {
        console.error('Error updating product', error);
        res.status(500).json({message: 'Error updating product'});
    }
});

router.delete('/inventory/:id', async (req: Request, res: Response) => {
    try {
        const inventory = await Inventory.findByIdAndDelete(req.params.id);
        if (inventory) {
            res.status(200).json({message: 'Product deleted successfully'});
        } else {
            res.status(404).json({message: 'Product not found'});
        }
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({message: 'Error deleting product'});
    }
});

router.get('/inventory', async (req: Request, res: Response) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error getting products', error);
        res.status(500).json({message: 'Error getting products'});
    }
});

export = router;
