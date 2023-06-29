import mongoose from "mongoose";

const URI_MONGO =
  "mongodb+srv://matiaswyso:pruebaback@coderback.gfheie6.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(URI_MONGO, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Conectado a la base de datos");
  }
});
