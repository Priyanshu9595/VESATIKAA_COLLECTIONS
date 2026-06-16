import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  collectionName: { type: String }, // Optional, can be part of category or separate
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  countInStock: { type: Number, required: true, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
