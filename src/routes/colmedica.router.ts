import { checkSchema } from "express-validator";
import { CreateTicketSchema } from "./schemas/ticket.schema";
import {
    saveNegotiationTabColmedica,
    getProvidersColmedica,
    getOfficeProvidersColmedica,
    getProductColmedica,
    getPlansColmedica,
    saveNegotiationTabPlansColmedica,
    getContactsProviderColmedica,
    getOccupationColmedica,
    getTypeFaresColmedica,
    getTypeRendomColmedica,
    saveNegotiationTabRendomColmedica,
    getTypeIncrementColmedica,
    saveNegotiationTabTypeIncrementColmedica,
    getTypeServiceColmedica,
    getClasificationTypeServiceColmedica,
    getServicesColmedica,
    getReferenceRateColmedica,
    getNegotiationTabColmedica,
    saveNegotiationTabServiceColmedica,
    saveNegotiationTabFareBaseColmedica,
    updateNegotiationTabServiceColmedica,
    saveLogicNegotiationTabCupsColmedica,
    getInfoLogicColmedica,
    getInfoOfficeProvider,
    getInfoLogicTableColmedica
} from "../controllers/colmedica.controller";
import { query } from "express-validator";
import { Router } from "express";
import { validateEnpoint } from "../middlewares/validatorEnpoint";

const routes = Router();

routes.post(
    "/negotiationTabColmedica",
    checkSchema(CreateTicketSchema),
    saveNegotiationTabColmedica
)

routes.post(
    "/negotiationTabFareBaseColmedica",
    checkSchema(CreateTicketSchema),
    saveNegotiationTabFareBaseColmedica
)

routes.post(
    "/negotiationTabServiceColmedica",
    checkSchema(CreateTicketSchema),
    saveNegotiationTabServiceColmedica
)

routes.post(
    "/negotiationTabPlansColmedica",
    checkSchema(CreateTicketSchema),
    saveNegotiationTabPlansColmedica
)

routes.post(
    "/negotiationTabRendomColmedica",
    checkSchema(CreateTicketSchema),
    saveNegotiationTabRendomColmedica
)

routes.post(
    "/negotiationTabTypeIncrementColmedica",
    checkSchema(CreateTicketSchema),
    saveNegotiationTabTypeIncrementColmedica
)

routes.post(
    "/saveLogicNegotiationTabCupsColmedica",
    checkSchema(CreateTicketSchema),
    saveLogicNegotiationTabCupsColmedica
)


routes.put(
    "/negotiationTabServiceColmedica",
    checkSchema(CreateTicketSchema),
    updateNegotiationTabServiceColmedica
)

routes.get(
    "/providersColmedicas",
    [
        query("idProvider", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getProvidersColmedica
)

routes.get(
    "/infoOfficeProvider",
    [
        query("idProvider", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getInfoOfficeProvider
)


routes.get(
    "/infoLogicColmedica",
    [
        query("id_NegotiationTabColmedica", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getInfoLogicColmedica
)



routes.get(
    "/infoLogicTableColmedica",
    [
        query("id_NegotiationTabColmedica", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getInfoLogicTableColmedica
)

routes.get(
    "/contactsProviderColmedica",
    [
        query("idProvider", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getContactsProviderColmedica
)

routes.get(
    "/officeProvidersColmedica",
    [
        query("idOfficeProvider", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getOfficeProvidersColmedica
)

routes.get(
    "/productColmedica",
    getProductColmedica
)

routes.get(
    "/occupationColmedica",
    [
        query("idOccupation", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getOccupationColmedica
)

routes.get(
    "/servicesColmedica",
    [
        query("idClasificationTypeService", "global.int_type_field").optional().isInt(),
        validateEnpoint
    ],
    getServicesColmedica
)


routes.get(
    "/plansColmedica",
    getPlansColmedica
)

routes.get(
    "/typeFaresColmedica",
    getTypeFaresColmedica
)

routes.get(
    "/typeRendomColmedica",
    getTypeRendomColmedica
)

routes.get(
    "/typeServiceColmedica",
    getTypeServiceColmedica
)

routes.get(
    "/typeIncrementColmedica",
    getTypeIncrementColmedica
)

routes.get(
    "/referenceRateColmedica",
    getReferenceRateColmedica
)

routes.get(
    "/clasificationTypeServiceColmedica",
    getClasificationTypeServiceColmedica
)


routes.get(
    "/negotiationTabColmedica",
    getNegotiationTabColmedica
)

export default routes;
