import { RequestHandler, Router } from "express";
import { check, checkSchema } from "express-validator";
import { validateApiKEY } from "../middlewares/validate-apikey";
import { CreateTicketSchema } from "./schemas/ticket.schema";
import { createTicket } from "../controllers/ticket.controller";

const routes = Router();

routes.post(
    "/create",
    checkSchema(CreateTicketSchema),
    createTicket
)

export default routes;
