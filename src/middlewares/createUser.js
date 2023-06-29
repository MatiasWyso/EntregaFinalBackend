import userManager from "../dao/classes/dbManager/UserManager.js";
import CartManager from '../dao/classes/dbManager/CartManager.js';

import {createHash, isValidPassword} from "../utils.js";

const um = new userManager();
const cm = new CartManager();

export const registerUser = async(req, res, next) => {
    const {first_name, last_name, age, email, password} = req.body;
    try {
        let user = await um.getOne({email: email});
        req.logger.debug("user");
        req.logger.debug("User: ", user);
        if (user != null) {
            req.logger.debug("El usuario ya existe");
            return res.send({status: "error", message: "El usuario ya existe"});
        }

        let cartObj = await cm.post();

        req.logger.debug("Cart")
        req.logger.debug(cartObj)

        let cart = cartObj._id

        const result = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart
        }

        req.newUser = result;

        let newUser = await um.post(result);
        
        next();
    } catch(error) {
        req.logger.debug("Error")
        req.logger.debug(error)
        next(error)
    }
}