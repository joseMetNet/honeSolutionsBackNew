"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Bolivar_Controller_1 = require("../controllers/Bolivar.Controller");
const validate_apikey_1 = require("../middlewares/validate-apikey");
const routes = (0, express_1.Router)();
//Rutas Bolivar
routes.get("/departamentos", validate_apikey_1.validateApiKEY, Bolivar_Controller_1.getDepartments);
routes.get("/cities", validate_apikey_1.validateApiKEY, Bolivar_Controller_1.getCities);
routes.get("/planes", validate_apikey_1.validateApiKEY, Bolivar_Controller_1.getPlans);
routes.get("/especialidades", validate_apikey_1.validateApiKEY, Bolivar_Controller_1.getSpecialties);
routes.get("/provedoresBolivar", validate_apikey_1.validateApiKEY, Bolivar_Controller_1.getProvidersBolivar);
exports.default = routes;
//# sourceMappingURL=router.Router.js.map