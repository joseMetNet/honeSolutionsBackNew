"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvidersBolivar = exports.getSpecialties = exports.getPlans = exports.getCities = exports.getDepartments = void 0;
const config_1 = require("../DB/config");
const getDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, config_1.connectToSqlServer)();
        const data = yield (db === null || db === void 0 ? void 0 : db.request().query(`SELECT DISTINCT 
                    td.idDepartament,
                    td.departament
                FROM TB_OfficeProvider topr
                LEFT JOIN TB_Department td on topr.idDepartament = td.idDepartament
                LEFT JOIN TB_OfficeProviderClientHoneSolution AS toc ON toc.idOfficeProvider = topr.idOfficeProvider
                LEFT JOIN TB_ClientHoneSolutions AS tch ON tch.idClientHoneSolutions = toc.idClientHoneSolutions
                WHERE tch.idClientHoneSolutions = 5`));
        const rows = data[0];
        if (rows.recordset.length === 0) {
            return {
                code: 204,
                message: { translationKey: "bolivar.emptyResponse" },
            };
        }
        return {
            code: 200,
            message: { translationKey: "bolivar.succesfull" },
            data: data === null || data === void 0 ? void 0 : data.recordset
        };
    }
    catch (err) {
        console.log("Error al traer departamentos", err);
        return {
            code: 400,
            message: { translationKey: "bolivar.error_server", translationParams: { name: "getDepartments" } },
        };
    }
    ;
});
exports.getDepartments = getDepartments;
const getCities = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idDepartamento } = data;
        const db = yield (0, config_1.connectToSqlServer)();
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
        const cities = yield (db === null || db === void 0 ? void 0 : db.request().query(orderQuery));
        const queryCitiesEmpty = cities[0];
        if (queryCitiesEmpty && Object.keys(queryCitiesEmpty).length === 0) {
            return {
                code: 204,
                message: { translationKey: "bolivar.emptyResponse" },
            };
        }
        else {
            return {
                code: 200,
                message: { translationKey: "bolivar.succesfull" },
                data: cities === null || cities === void 0 ? void 0 : cities.recordset
            };
        }
    }
    catch (err) {
        console.log("Error al traer ciudades", err);
        return {
            code: 400,
            message: { translationKey: "bolivar.error_server" },
        };
    }
});
exports.getCities = getCities;
const getPlans = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCiudad } = data;
        const db = yield (0, config_1.connectToSqlServer)();
        let queryPlans = `SELECT DISTINCT p.idPlan,p.[plan] FROM TB_Plans as p
        INNER JOIN TB_CategoryClasificationSpecialityAccesPlanPriorizationOffice AS pap ON pap.idPlan = p.idPlan
        INNER JOIN TB_OfficeProviderClientHoneSolution AS opc ON opc.idOfficeProvider = pap.idOfficeProvider
        INNER JOIN TB_OfficeProvider AS op ON op.idOfficeProvider = opc.idOfficeProvider
        INNER JOIN TB_Roles AS tr ON tr.idClientHoneSolutions=opc.idClientHoneSolutions
        WHERE tr.idRoles=9  AND  pap.idPublicationPrioritizacion != 5`;
        if (idCiudad !== undefined) {
            queryPlans += ` AND op.idCity = ${idCiudad}`;
        }
        const plans = yield (db === null || db === void 0 ? void 0 : db.request().query(queryPlans));
        const queryPlansEmpty = plans[0];
        if (queryPlansEmpty && Object.keys(queryPlansEmpty).length === 0) {
            return {
                code: 204,
                message: { translationKey: "bolivar.emptyResponse" },
            };
        }
        else {
            return {
                code: 200,
                message: { translationKey: "bolivar.succesfull" },
                data: plans === null || plans === void 0 ? void 0 : plans.recordset
            };
        }
    }
    catch (err) {
        console.log("Error al traer los planes", err);
        return {
            code: 400,
            message: { translationKey: "bolivar.error_server" },
        };
    }
});
exports.getPlans = getPlans;
const getSpecialties = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idCiudad, idDepartamento, idPlan } = data;
        const db = yield (0, config_1.connectToSqlServer)();
        let querySpeciality = `
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
        const speciality = yield (db === null || db === void 0 ? void 0 : db.request().query(orderQuery));
        if (speciality.recordset.length === 0) {
            return {
                code: 204,
                message: { translationKey: "bolivar.emptyResponse" },
            };
        }
        else {
            return {
                code: 200,
                message: { translationKey: "bolivar.succesfull" },
                data: speciality === null || speciality === void 0 ? void 0 : speciality.recordset
            };
        }
    }
    catch (err) {
        console.log("Error al traer las especialidades", err);
        return {
            code: 400,
            message: { translationKey: "bolivar.error_server" },
        };
    }
});
exports.getSpecialties = getSpecialties;
const getProvidersBolivar = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pagina = 0, tamano = 10, idDepartamento, idCiudad, idPlan, idEspecialidad, nombreComercial } = data;
        const skip = pagina * tamano;
        const db = yield (0, config_1.connectToSqlServer)();
        let basic_query = `
        SELECT
        topr.idOfficeProvider AS idSucursal,
          ttd.typeDocument AS TypeDocument,
          topp.identificacion AS identificacion,
        topr.OfficeProviderName AS nombreComercial,   
        td.departament,
          tc.city,
          tp.[plan] AS plans,
          tse.speciality AS especialidad,
          pap.publicationPrioritizacion,
        topr.[address] AS direccion,
        CASE WHEN CHARINDEX('#', topr.TelephoneOffice) = 0 THEN 
                CASE WHEN topr.TelephoneOffice = '' THEN '' ELSE tc.indicative + ' ' + topr.TelephoneOffice END
             ELSE
                topr.TelephoneOffice
        END AS telefonoConsultorio,  
        CASE WHEN CHARINDEX('#', topr.telephone3) = 0 THEN 
                CASE WHEN topr.telephone3 = '' THEN '' ELSE tc.indicative + ' ' + topr.telephone3 END
             ELSE
                topr.telephone3
        END AS telefonoConsultorio1,  
        CASE WHEN CHARINDEX('#', topr.telephone4) = 0 THEN 
                CASE WHEN topr.telephone4 = '' THEN '' ELSE tc.indicative + ' ' + topr.telephone4 END
             ELSE
                topr.telephone4
        END AS telefonoConsultorio2,  
        CASE WHEN CHARINDEX('#', topr.telephone5) = 0 THEN 
                CASE WHEN topr.telephone5 = '' THEN '' ELSE tc.indicative + ' ' + topr.telephone5 END
             ELSE
                topr.telephone5
        END AS telefonoConsultorio3,   
          topr.cell1 AS celular,
        topr.cell2 AS celular2,
        topr.line1Whatsapp AS lineaWhatsApp1,
        topr.line2Whatsapp AS lineaWhatsApp2,
        topr.datingEmail AS email,
        ISNULL(topp.ProviderWebsite, '') AS paginaWeb,
          topr.schedulingLink AS linkAgendamiento,
          topp.ComplexityLevel AS nivelComplejidad,
          topr.workHours AS horarios
        FROM TB_OfficeProviderClientHoneSolution AS toc WITH(NOLOCK)
     INNER JOIN TB_OfficeProvider AS topr WITH(NOLOCK) on topr.idOfficeProvider=toc.idOfficeProvider
     INNER JOIN TB_Roles AS tr WITH(NOLOCK) ON tr.idClientHoneSolutions=toc.idClientHoneSolutions
     INNER JOIN TB_Provider AS topp WITH(NOLOCK) ON topp.idProvider = topr.idProvider
     INNER JOIN TB_CategoryClasificationSpecialityAccesPlanPriorizationOffice  AS tpap WITH(NOLOCK) ON tpap.idOfficeProvider = topr.idOfficeProvider
     INNER JOIN TB_PublicationPrioritizacion as pap WITH(NOLOCK) on pap.idPublicationPrioritizacion = tpap.idPublicationPrioritizacion
     INNER JOIN TB_typeDocument as ttd WITH(NOLOCK) ON ttd.idTypeDocument=topp.idTypeDocument
     INNER JOIN TB_Plans AS tp WITH(NOLOCK) ON tp.idPlan = tpap.idPlan
     INNER JOIN TB_Speciality AS tse WITH(NOLOCK) ON tse.idSpeciality = tpap.idSpeciality
     INNER JOIN TB_Department AS td WITH(NOLOCK) ON td.idDepartament = topr.idDepartament
     INNER JOIN TB_City AS tc WITH(NOLOCK) ON tc.idCity = topr.idCity
     WHERE tr.idRoles = 9 AND tpap.idPublicationPrioritizacion != 5
        `;
        let basic_count = `
        SELECT
        COUNT(topp.idProvider) cant
        FROM TB_OfficeProviderClientHoneSolution AS toc WITH(NOLOCK)
        INNER JOIN TB_OfficeProvider AS topr WITH(NOLOCK) on topr.idOfficeProvider=toc.idOfficeProvider
        INNER JOIN TB_Roles AS tr WITH(NOLOCK) ON tr.idClientHoneSolutions=toc.idClientHoneSolutions
        INNER JOIN TB_Provider AS topp WITH(NOLOCK) ON topp.idProvider = topr.idProvider
        INNER JOIN TB_CategoryClasificationSpecialityAccesPlanPriorizationOffice  AS tpap WITH(NOLOCK) ON tpap.idOfficeProvider = topr.idOfficeProvider
        INNER JOIN TB_PublicationPrioritizacion as pap WITH(NOLOCK) on pap.idPublicationPrioritizacion = tpap.idPublicationPrioritizacion
        INNER JOIN TB_typeDocument as ttd WITH(NOLOCK) ON ttd.idTypeDocument=topp.idTypeDocument
        INNER JOIN TB_Plans AS tp WITH(NOLOCK) ON tp.idPlan = tpap.idPlan
        INNER JOIN TB_Speciality AS tse WITH(NOLOCK) ON tse.idSpeciality = tpap.idSpeciality
        INNER JOIN TB_Department AS td WITH(NOLOCK) ON td.idDepartament = topr.idDepartament
        INNER JOIN TB_City AS tc WITH(NOLOCK) ON tc.idCity = topr.idCity
        WHERE tr.idRoles = 9 AND tpap.idPublicationPrioritizacion != 5
        `;
        const filters = {
            idDepartamento: 'td.idDepartament',
            idCiudad: 'tc.idCity',
            idPlan: 'tp.idPlan',
            idEspecialidad: 'tse.idSpeciality',
            nombreComercial: 'topr.OfficeProviderName'
        };
        for (const [key, value] of Object.entries(filters)) {
            if (typeof value === 'function') {
                const dataValue = data[key];
                if (dataValue !== undefined) {
                    const processedValue = value(dataValue);
                    basic_query += ` AND ${processedValue}`;
                    basic_count += ` AND ${processedValue}`;
                }
            }
            else {
                const dataValue = data[key];
                if (dataValue !== undefined) {
                    basic_query += ` AND ${value}='${dataValue}'`;
                    basic_count += ` AND ${value}='${dataValue}'`;
                }
            }
        }
        basic_query = basic_query +
            '\nGROUP BY ' +
            'topr.idOfficeProvider,\n' +
            'ttd.typeDocument,\n' +
            'topp.identificacion,\n' +
            'topr.OfficeProviderName,\n' +
            'td.departament,\n' +
            'tc.city,\n' +
            'tc.indicative,\n' +
            'tp.[plan],\n' +
            'tse.speciality,\n' +
            'pap.publicationPrioritizacion,\n' +
            'topr.[address],\n' +
            'topr.TelephoneOffice,\n' +
            'topr.telephone3,\n' +
            'topr.telephone4,\n' +
            'topr.telephone5,\n' +
            'topp.identificacion,\n' +
            'topr.cell1,\n' +
            'topr.cell2,\n' +
            'topr.line1Whatsapp,\n' +
            'topr.line2Whatsapp,\n' +
            'topr.datingEmail,\n' +
            'topp.ProviderWebsite,\n' +
            'topr.schedulingLink,\n' +
            'topp.ComplexityLevel,\n' +
            'topr.workHours\n' +
            'ORDER BY topr.OfficeProviderName ASC, pap.publicationPrioritizacion DESC\n' +
            `\nOFFSET ${skip.toString()} ROWS FETCH NEXT ${tamano.toString()} ROWS ONLY`;
        basic_count = 'SELECT COUNT(1) cant FROM (\n' + basic_count +
            '\n GROUP BY\n' +
            'topr.idOfficeProvider,\n' +
            'ttd.typeDocument,\n' +
            'topp.identificacion,\n' +
            'topr.OfficeProviderName,\n' +
            'td.departament,\n' +
            'tc.city,\n' +
            'tp.[plan],\n' +
            'tse.speciality,\n' +
            'pap.publicationPrioritizacion,\n' +
            'topr.[address],\n' +
            'topr.TelephoneOffice,\n' +
            'topr.TelephoneOffice1,\n' +
            'topr.telephone3,\n' +
            'topr.telephone4,\n' +
            'topp.identificacion,\n' +
            'topr.cell1,\n' +
            'topr.cell2,\n' +
            'topr.line1Whatsapp,\n' +
            'topr.line2Whatsapp,\n' +
            'topr.datingEmail,\n' +
            'topp.ProviderWebsite,\n' +
            'topr.schedulingLink,\n' +
            'topp.ComplexityLevel,\n' +
            'topr.workHours\n' +
            ') cte';
        const count = yield (db === null || db === void 0 ? void 0 : db.request().query(basic_count));
        const rows = yield (db === null || db === void 0 ? void 0 : db.request().query(basic_query));
        const cant = count.recordset[0];
        if (rows.recordset.length === 0) {
            return {
                code: 204,
                message: { translationKey: "bolivar.emptyResponse" }
            };
        }
        else {
            return {
                code: 200,
                message: { translationKey: "bolivar.succesfull" },
                data: rows === null || rows === void 0 ? void 0 : rows.recordset,
                totalData: cant['cant'],
                totalPage: Math.ceil(cant['cant'] / tamano)
            };
        }
    }
    catch (err) {
        console.log("Error al traer los provedores", err);
        return {
            code: 400,
            message: { translationKey: "bolivar.error_server" },
        };
    }
});
exports.getProvidersBolivar = getProvidersBolivar;
//# sourceMappingURL=Bolivar.Repository.js.map