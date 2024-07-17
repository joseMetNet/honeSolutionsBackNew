import { connectToSqlServer } from "../DB/config"

export const getDepartmentsBolivar = async () => {
    try {
        const db = await connectToSqlServer();
        const result = await db?.request().query(`
            SELECT DISTINCT 
                td.idDepartament,
                td.departament
            FROM TB_OfficeProvider topr
            LEFT JOIN TB_Department td on topr.idDepartament = td.idDepartament
            LEFT JOIN TB_OfficeProviderClientHoneSolution AS toc ON toc.idOfficeProvider = topr.idOfficeProvider
            LEFT JOIN TB_ClientHoneSolutions AS tch ON tch.idClientHoneSolutions = toc.idClientHoneSolutions
            WHERE tch.idClientHoneSolutions = 5
        `);

        if (!result || !result.recordset) {
            return {
                code: 204,
                message: { translationKey: "department.emptyResponse" },
            };
        }

        const rows = result.recordset;

        if (rows.length === 0) {
            return {
                code: 204,
                message: { translationKey: "department.emptyResponse" },
            };
        }

        return {
            code: 200,
            message: { translationKey: "department.succesfull" },
            data: rows,
        };
    } catch (err: any) {
        console.log("Error al traer departamentos", err);
        return {
            code: 400,
            message: { translationKey: "department.error_server", translationParams: { name: "getDepartmentsBolivar" } },
        };
    }
};
