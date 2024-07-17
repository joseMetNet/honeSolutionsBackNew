import { Router } from "express";
import { validateApiKEY } from "../middlewares/validate-apikey";
import { getSpecialtiesBolivar } from "../controllers/specialty.controller";

const routerSpecialty = Router();

routerSpecialty.get("/especialidadesBolivar", validateApiKEY, getSpecialtiesBolivar);

export default routerSpecialty;