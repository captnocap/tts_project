import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: String,
  orderNotes: String,
  audioPath: String, // New field to store the path of the generated audio file
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
