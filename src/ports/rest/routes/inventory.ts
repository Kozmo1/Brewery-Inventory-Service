import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { InventoryController } from '../../../controllers/inventoryController'; // Adjust the path as needed

const router = express.Router();
const inventoryController = new InventoryController();

router.post('/inventory/add-product',
    body('name').notEmpty().withMessage('A Name is required'),
    body('type').isIn(['Beer', 'Cocktail', 'Liqueur', 'Hard Seltzer']).withMessage('Invalid product type'),
    body('description').notEmpty().withMessage('A description is required'),
    body('abv').isFloat({ min: 0 }).withMessage('ABV must be a number greater or equal to 0'),
    body('volume').isFloat({ min: 0 }).withMessage('Volume must be a number greater or equal to 0'),
    body('package').isIn(['Can', 'Bottle']).withMessage('Invalid package type'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a number greater or equal to 0'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a number greater or equal to 0'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a number greater or equal to 0'),
    body('reorderPoint').isInt({ min: 0 }).withMessage('Reorder point must be a number greater or equal to 0'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean'),
    body('tasteProfile').isObject().withMessage('Taste profile must be an object'),
    (req: Request, res: Response, next: NextFunction) => inventoryController.addProduct(req, res, next)
);

router.get('/inventory/:id', 
    (req: Request, res: Response, next: NextFunction) => inventoryController.getProductById(req, res, next)
);

router.put('/inventory/:id', 
    (req: Request, res: Response, next: NextFunction) => inventoryController.updateProduct(req, res, next)
);

router.delete('/inventory/:id', 
    (req: Request, res: Response, next: NextFunction) => inventoryController.deleteProduct(req, res, next)
);

router.get('/inventory', 
    (req: Request, res: Response, next: NextFunction) => inventoryController.getAllProducts(req, res, next)
);

export = router;