import mongoose from 'mongoose';
import tasteProfileSchema from './tasteProfile';

const InventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['Beer', 'Cocktail', 'Liqueur', 'Hard Seltzer'],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      abv: {
        type: Number,
        required: true,
        min: 0
      },
      volume: {
        type: Number,
        required: true,
        min: 0
      },
      package: {
        type: String,
        enum: ['Can', 'Bottle'],
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      cost: {
        type: Number,
        required: true,
        min: 0
      },
      stockQuantity: {
        type: Number,
        required: true,
        min: 0
      },
      reorderPoint: {
        type: Number,
        required: true,
        min: 0
      },
      isActive: {
        type: Boolean,
        required: true,
      },
      tasteProfile: {
        type: tasteProfileSchema,
        required: true,
      },
      createdAt: { type: Date, default: Date.now }
    });
export const Inventory = mongoose.model('Inventory', InventorySchema);