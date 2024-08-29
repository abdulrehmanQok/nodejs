import express from 'express';
import { register } from '../controller/usercontroller.js';
const routes = express.Router();

routes.route("/register").post(register)


export default routes;