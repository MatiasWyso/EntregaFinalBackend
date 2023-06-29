import { Router } from 'express';


import UsersController from '../controller/users.controller.js';

import { userData } from "../middlewares/userData.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
const uc = new UsersController();

router.get('/', uc.getAll);

router.delete('/', userData, uc.deleteInactive);

router.put('/swapRoleForced/:uid', isAdmin, uc.postSwapRoleForced);

router.delete('/:uid', isAdmin, uc.deleteUser);

export default router;