import mongoose from 'mongoose';

const tasteProfileSchema = new mongoose.Schema({
  primaryFlavor: String,
  secondaryFlavors: [String],
  sweetness: { 
    type: String, 
    enum: ['Dry', 'Semi-Sweet', 'Sweet']
  },
  bitterness: { 
    type: String, 
    enum: ['Low', 'Moderate', 'High']
  },
  mouthfeel: {
    type: String,
    enum: ['Crisp', 'Smooth', 'Creamy']
  },
  body: {
    type: String,
    enum: ['Light', 'Medium', 'Full']
  },
  acidity: Number,
  aftertaste: String,
  aroma: [{
    type: String,
    enum: [
      'Citrus', 'Floral', 'Herbal', 'Spicy', 'Earthy', 
      'Fruity', 'Nutty', 'Caramel', 'Vanilla', 'Woody', 
      'Smoky', 'Grassy', 'Bready', 'Malty', 'Roasted'
    ]
  }]
});

export default tasteProfileSchema;