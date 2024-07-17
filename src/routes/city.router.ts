import { Router } from "express";
import { validateApiKEY } from "../middlewares/validate-apikey";
import { getCitiesBolivar } from "../controllers/city.controller";
import { param } from "express-validator";
import { validateEnpoint } from "../middlewares/validatorEnpoint";

const routesCity = Router();

routesCity.get(
    "/citiesBolivar",
    [
        param("idDepartamento", "department.invalidIdDepartment").optional(),
        validateEnpoint
    ],
    validateApiKEY, getCitiesBolivar);

export default routesCity;