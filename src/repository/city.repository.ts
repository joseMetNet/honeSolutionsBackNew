import { connectToSqlServer } from "../DB/config"
import { CitiesRepositoryService, dataCity } from "../interface/city.interface";

export const getCitiesBolivar = async (data: dataCity): Promise<CitiesRepositoryService> => {
    try {
        const { idDepartamento } = data;
        const db = await connectToSqlServer();

        let queryCities = `SELECT DISTINCT op.idCity, c.city, op.idDepartament FROM TB_CategoryClasificationSpecialityAccesPlanPriorizationOffice AS opp
            INNER JOIN TB_OfficeProvider AS op ON op.idOfficeProvider = opp.idOfficeProvider
            INNER JOIN TB_City AS c ON c.idCity = op.idCity
            INNER JOIN TB_OfficeProviderClientHoneSolution AS opc ON opc.idOfficeProvider = opp.idOfficeProvider
            INNER JOIN TB_Roles AS r ON r.idClientHoneSolutions = opc.idClientHoneSolutions
            WHERE r.idRoles = 9 AND opp.idPublicationPrioritizacion != 5`;

        if (idDepartamento !== undefined) {
            queryCities += ` AND op.idDepartament = ${idDepartamento}`;
        }

        const orderQuery = queryCities + ' ORDER BY c.city';

        const cities: any = await db?.request().query(orderQuery);

        const queryCitiesEmpty = cities[0];

        if (queryCitiesEmpty && Object.keys(queryCitiesEmpty).length === 0) {
            return {
                code: 204,
                message: { translationKey: "city.emptyResponse" },
            };
        } else {
            return {
                code: 200,
                message: { translationKey: "city.succesfull" },
                data: cities?.recordset
            };
        }
    } catch (err) {
        console.log("Error al traer ciudades", err);
        return {
            code: 400,
            message: { translationKey: "city.error_server" },
        };
    }
};