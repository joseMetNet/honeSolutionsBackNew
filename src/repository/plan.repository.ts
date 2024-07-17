import { connectToSqlServer } from "../DB/config"
import { dataPlan, PlansRepositoryService } from "../interface/plan.interface";

export const getPlansBolivar = async (data: dataPlan): Promise<PlansRepositoryService> => {
    try {
        const { idCiudad } = data;
        const db = await connectToSqlServer();
        let queryPlans = `SELECT DISTINCT p.idPlan,p.[plan] FROM TB_Plans as p
        INNER JOIN TB_CategoryClasificationSpecialityAccesPlanPriorizationOffice AS pap ON pap.idPlan = p.idPlan
        INNER JOIN TB_OfficeProviderClientHoneSolution AS opc ON opc.idOfficeProvider = pap.idOfficeProvider
        INNER JOIN TB_OfficeProvider AS op ON op.idOfficeProvider = opc.idOfficeProvider
        INNER JOIN TB_Roles AS tr ON tr.idClientHoneSolutions=opc.idClientHoneSolutions
        WHERE tr.idRoles=9  AND  pap.idPublicationPrioritizacion != 5`;

        if (idCiudad !== undefined) {
            queryPlans += ` AND op.idCity = ${idCiudad}`;
        }
        const plans: any = await db?.request().query(queryPlans);
        const queryPlansEmpty = plans[0];

        if (queryPlansEmpty && Object.keys(queryPlansEmpty).length === 0) {
            return {
                code: 204,
                message: { translationKey: "plan.emptyResponse" },
            };
        } else {
            return {
                code: 200,
                message: { translationKey: "plan.succesfull" },
                data: plans?.recordset
            };
        }
    } catch (err) {
        console.log("Error al traer los planes", err);
        return {
            code: 400,
            message: { translationKey: "plan.error_server"},
        };
    }
};