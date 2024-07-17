import { Router } from "express";
import { getProvidersBolivar } from "../controllers/officeProvider.Controller";
import { validateApiKEY } from "../middlewares/validate-apikey";
import { param } from "express-validator";
import { validateEnpoint } from "../middlewares/validatorEnpoint";

const routesOfficeProvider = Router();

routesOfficeProvider.get(
    "/provedoresBolivar",
    [
        param("pagina","officeProvider.invalidPage").optional(),
        param("tamano","officeProvider.invalidSize").optional(),
        param("idDepartamento","department.invalidIdDepartment").optional(),
        param("idCiudad","city.invalidIdCity").optional(),
        param("idPlan","plan.invalidIdPlan").optional(),
        param("idEspecialidad","specialty.invalidIdSpecialty").optional(),
        param("nombreComercial","officeProvider.invalidName").optional(),
        validateEnpoint
    ],
    validateApiKEY, getProvidersBolivar);

export default routesOfficeProvider;
