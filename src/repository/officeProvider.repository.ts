import { connectToSqlServer } from "../DB/config"
import { IresponseRepositoryService, dataProvider } from "../interface/officeProvider.Interface";

export const getProvidersBolivar = async (data: dataProvider): Promise<IresponseRepositoryService> => {
    try {
        const { pagina = 0, tamano = 10 } = data;

        const skip = pagina * tamano;
        const db = await connectToSqlServer();
        let basic_query =
            `
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
        let basic_count =
            `
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
        const filters: dataProvider = {
            idDepartamento: 'td.idDepartament',
            idCiudad: 'tc.idCity',
            idPlan: 'tp.idPlan',
            idEspecialidad: 'tse.idSpeciality',
            nombreComercial: 'topr.OfficeProviderName'
        };
        
        for (const [key, value] of Object.entries(filters)) {
            if (typeof value === 'function') {
                const dataValue = data[key as keyof dataProvider];
                if (dataValue !== undefined) {
                    const processedValue = value(dataValue);
                    basic_query += ` AND ${processedValue}`;
                    basic_count += ` AND ${processedValue}`;
                }
            } else {
                const dataValue = data[key as keyof dataProvider];
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
            `\nOFFSET ${skip.toString()} ROWS FETCH NEXT ${tamano.toString()} ROWS ONLY`
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
        const count: any = await db?.request().query(basic_count);
        const rows: any = await db?.request().query(basic_query);
        const cant: any = count.recordset[0];
        if (rows.recordset.length === 0) {
            return {
                code: 204,
                message: { translationKey: "officeProvider.emptyResponse" }
            };
        } else {
            return {
                code: 200,
                message: { translationKey: "officeProvider.succesfull" },
                data: rows?.recordset,
                totalData: cant['cant'],
                totalPage: Math.ceil(cant['cant'] / tamano)
            };
        }
    } catch (err) {
        console.log("Error al traer los provedores", err);
        return {
            code: 400,
            message: { translationKey: "officeProvider.error_server" },
        };
    }
}


