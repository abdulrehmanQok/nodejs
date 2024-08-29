import express from 'express';
import { DeleteUser, GetUser, register, UpdateUser } from '../controller/usercontroller.js';
const routes = express.Router();

routes.route("/register").post(register);
routes.route("/Get").get(GetUser);
routes.route("/update/:id").put(UpdateUser);
routes.route("/delete/:id").delete(DeleteUser);
export default routes;