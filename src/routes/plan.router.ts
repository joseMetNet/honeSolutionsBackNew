import { Router } from "express";
import { validateApiKEY } from "../middlewares/validate-apikey";
import { getPlansBolivar } from "../controllers/plan.controller";
import { param } from "express-validator";
import { validateEnpoint } from "../middlewares/validatorEnpoint";

const routerPlan = Router();

routerPlan.get(
    "/planesBolivar",
    [
        param("idCiudad", "city.invalidIdCity").optional(),
        validateEnpoint
    ],
    validateApiKEY, getPlansBolivar);

export default routerPlan;