import config from "../config/config.js";
import mongoose from "mongoose";

export let Carts;
export let Products;
export let Users;
export let Connection;
export let Tickets;

switch (config.persistence) {
  case "MONGO":
    mongoose.set("strictQuery", false);
    mongoose.connect(config.mongoUrl, (error) => {
      if (error) {
        console.log("No hubo conexion", error);
        process.exit();
      }
    });
    const { default: CartsMongo } = await import(
      "./classes/dbManager/CartManager.js"
    );
    const { default: ProductsMongo } = await import(
      "./classes/dbManager/ProductManager.js"
    );
    const { default: UsersMongo } = await import(
      "./classes/dbManager/UserManager.js"
    );
    const { default: TicketsMongo } = await import("./classes/dbManager/TicketsManager.js");

    Carts = CartsMongo;
    Products = ProductsMongo;
    Users = UsersMongo;
    Tickets = TicketsMongo;
    break;
  case "MEMORY":
    const { default: CartsMemory } = await import(
      "./classes/fileManager/CartManager.js"
    );
    const { default: ProductsMemory } = await import(
      "./classes/fileManager/ProductManager.js"
    );
    const { default: UsersMemory } = await import(
      "./classes/fileManager/UserManager.js"
    );
    const { default: TicketsMemory } = await import("./classes/fileManager/TicketsManager.js");

    Carts = CartsMemory;
    Products = ProductsMemory;
    Users = UsersMemory;
    Tickets = TicketsMemory;
    break;
}
