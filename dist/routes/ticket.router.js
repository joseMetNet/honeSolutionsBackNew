"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ticket_schema_1 = require("./schemas/ticket.schema");
const ticket_controller_1 = require("../controllers/ticket.controller");
const routes = (0, express_1.Router)();
routes.post("/create", (0, express_validator_1.checkSchema)(ticket_schema_1.CreateTicketSchema), ticket_controller_1.createTicket);
exports.default = routes;
//# sourceMappingURL=ticket.router.js.map