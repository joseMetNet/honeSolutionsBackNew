import { connectToSqlServer } from "../DB/config"
import { dataSpeciality, SpecialitiesRepositoryService } from "../interface/specialty.interface";

export const getSpecialtiesBolivar = async (data: dataSpeciality): Promise<SpecialitiesRepositoryService> => {
    try {
        const {idCiudad, idDepartamento, idPlan} = data;
        const db = await connectToSqlServer();
        let querySpeciality =
            `
        SELECT DISTINCT
        s.idSpeciality,
        s.speciality
        FROM  TB_CategoryClasificationSpecialityAccesPlanPriorizationOffice as css
        inner join TB_OfficeProvider as op on op.idOfficeProvider = css.idOfficeProvider
        inner join TB_Speciality as s on s.idSpeciality = css.idSpeciality
        LEFT JOIN TB_OfficeProviderClientHoneSolution AS tch ON tch.idOfficeProvider = op.idOfficeProvider
        WHERE tch.idClientHoneSolutions = 5 AND css.idPublicationPrioritizacion != 5
      `;
        if (idCiudad !== undefined) {
            querySpeciality += ` AND op.idCity=${idCiudad}`;
        }
        if (idDepartamento !== undefined) {
            querySpeciality += ` AND op.idDepartament=${idDepartamento}`;
        }
        if (idPlan !== undefined) {
            querySpeciality += ` AND css.idPlan=${idPlan}`;
        }
        const orderQuery = querySpeciality + ' ORDER BY s.speciality ASC';
        const speciality: any = await db?.request().query(orderQuery);

        if (speciality.recordset.length === 0) {
            return {
                code: 204,
                message: { translationKey: "specialty.emptyResponse" },
            };
        } else {
            return {
                code: 200,
                message: { translationKey: "specialty.succesfull" },
                data: speciality?.recordset
            };
        }
    } catch (err) {
        console.log("Error al traer las especialidades", err);
        return {
            code: 400,
            message: { translationKey: "specialty.error_server" },
        };
    }
};