import mongoose from "mongoose";

const ticketsCollection = "Tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    purchaseDateTime: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
);

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);
export default ticketModel;
