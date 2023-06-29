import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: String,
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

const cartModel = mongoose.model(cartsCollection, cartSchema);
export default cartModel;
