import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  imageUrl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Product', productSchema);
