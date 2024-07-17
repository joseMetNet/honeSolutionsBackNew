import { Router } from "express";
import { validateApiKEY } from "../middlewares/validate-apikey";
import { getDepartmentsBolivar } from "../controllers/department.controller";

const routesDepartment = Router();

routesDepartment.get("/departamentosBolivar", validateApiKEY, getDepartmentsBolivar);

export default routesDepartment;