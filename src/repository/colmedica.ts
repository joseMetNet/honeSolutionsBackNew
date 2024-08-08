import { connectToSqlServer } from "../DB/config"
import { IresponseRepositoryService } from "../interface/general";
import {
  INegotiationTabColmedica,
  IProviderColmedica,
  IOfficeProviderColmedica,
  IProductColmedica,
  IPlansColmedica,
  INegotiationTabPlansColmedica,
  IContactsProviderColmedica,
  IOccupationColmedica,
  ITypeRendomColmedica,
  INegotiationTabRendomColmedica,
  ITypeIncrementColmedica,
  INegotiationTabTypeIncrementColmedica,
  INegotiationTabServiceColmedica,
  ISaveNegotiationTabFareBaseColmedica,
  IUpdateNegotiationTabServiceColmedica,
  ILogicNegotiationTabCupsColmedica
} from "../interface/colmedica";


export const saveNegotiationTabColmedica = async (
  negotiationTabColmedica: INegotiationTabColmedica
): Promise<IresponseRepositoryService> => {
  try {
    const { idOfficeProvider, idProduct, dateBegin, idContactsProvider, dateEnd } = negotiationTabColmedica;
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryPlans = `
    INSERT INTO [dbo].[TB_NegotiationTabColmedica]
    ([idOfficeProvider], [dateBegin], [dateEnd], [idContactsProvider], [idProduct])
    OUTPUT inserted.*
    VALUES (@idOfficeProvider, @dateBegin, @dateEnd, @idContactsProvider, @idProduct);
  `;

    const request = db.request();
    request.input("idOfficeProvider", idOfficeProvider);
    request.input("dateBegin", dateBegin);
    request.input("dateEnd", dateEnd);
    request.input("idContactsProvider", idContactsProvider);
    request.input("idProduct", idProduct);

    const result = await request.query(queryPlans);

    if (!result.recordset || result.recordset.length === 0) {
      throw new Error("Failed to insert and retrieve the record");
    }

    const insertedRecord = result.recordset[0];

    return {
      code: 200,
      message: "ok",
      data: insertedRecord,
    };
  } catch (err: any) {
    console.error("Error in saveNegotiationTabColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "saveNegotiationTabColmedica" },
      },
    };
  }
};


export const saveLogicNegotiationTabCupsColmedica = async (
  negotiationTabColmedica: ILogicNegotiationTabCupsColmedica
): Promise<IresponseRepositoryService> => {
  try {
    const { id_NegotiationTabColmedica } = negotiationTabColmedica;
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const insertQuery = `
      insert into [TB_NegotiationTabCupsColmedica] 
      select  @id_NegotiationTabColmedica,ts.idSpeciality,ma.idMedicalAct,'' as idTypeIncrement,ma.code,ma.code,ma.code,1,'',
      ntb.idTypeFareGamaAltaU,
      ntb.fareGamaAltaOperation AS PrecioGamaAltaA
      ,ntb.fareHumanOperation AS PrecioGamaHumanaA
      ,ntb.fareGamaMediaOperation AS PrecioGamaMediaA
      ,ntb.fareGamaMenorOperation AS PrecioGamaMenorA
      ,ntb.farePreferenciaOperation AS PrecioGamaPreferencialA
      ,ntb.idTypeFareGamaAltaU,
      ntb.fareGamaAltaOperation AS PrecioGamaAltaA
      ,ntb.fareHumanOperation AS PrecioGamaHumanaH
      ,ntb.fareGamaMediaOperation AS PrecioGamaMediaH
      ,ntb.fareGamaMenorOperation AS PrecioGamaMenorH
      ,ntb.farePreferenciaOperation AS PrecioGamaPreferencialH
      from TB_NegotiationTabServiceColmedica as ntb
      inner join TB_Speciality as ts on ntb.idSpeciality = ts.idSpeciality
      inner join TB_MedicalAct as ma on ma.idSpeciality = ts.idSpeciality
      inner join TB_ClasificationTypeServiceSpeciality as cts on cts.idSpeciality = ts.idSpeciality
      inner join TB_ClasificationTypeService as ct on ct.idClasificationTypeService = cts.idClasificationTypeService
      where ntb.id_NegotiationTabColmedica = @id_NegotiationTabColmedica and idTypeFareGamaAltaU in (6,18)
    `;

    const insertQuery2 = `
      insert into [TB_NegotiationTabCupsColmedica] 
      select  @id_NegotiationTabColmedica,ts.idSpeciality,ma.idMedicalAct,ntti.idTypeIncrement,ma.code,ma.code,ma.code,1,
      ntb.idTypeFareGamaAltaU,
      CAST(REPLACE((fs.fare + (ntb.fareGamaAltaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaAltaA
      ,CAST(REPLACE((fs.fare + (ntb.fareHumanOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaHumanaA
      ,CAST(REPLACE((fs.fare + (ntb.fareGamaMediaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMediaA
      ,CAST(REPLACE((fs.fare + (ntb.fareGamaMenorOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMenorA
      ,CAST(REPLACE((fs.fare + (ntb.farePreferenciaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaPreferencialA
      ,ntb.idTypeFareGamaAltaU
      ,ntb.idTypeFareGamaAltaU,CAST(REPLACE((fs.fare + (ntb.fareGamaAltaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaAltaA
      ,CAST(REPLACE((fs.fare + (ntb.fareHumanOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaHumanaH
      ,CAST(REPLACE((fs.fare + (ntb.fareGamaMediaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMediaH
      ,CAST(REPLACE((fs.fare + (ntb.fareGamaMenorOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMenorH
      ,CAST(REPLACE((fs.fare + (ntb.farePreferenciaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaPreferencialH
      from TB_NegotiationTabServiceColmedica as ntb
      left join TB_Speciality as ts on ntb.idSpeciality = ts.idSpeciality
      left join TB_MedicalAct as ma on ma.idSpeciality = ts.idSpeciality
      inner join TB_FareSoat  as fs on fs.idMedicalAct = ma.idMedicalAct
      left join TB_NegotiationTabTypeIncrement as ntti on ntti.id_NegotiationTabColmedica = ntb.id_NegotiationTabColmedica
      left join TB_ClasificationTypeServiceSpeciality as cts on cts.idSpeciality = ts.idSpeciality
      left join TB_ClasificationTypeService as ct on ct.idClasificationTypeService = cts.idClasificationTypeService
      where ntb.id_NegotiationTabColmedica = @id_NegotiationTabColmedica and ntti.idTypeIncrement = 1
    `;

    const insertQuery3 = `
    insert into [TB_NegotiationTabCupsColmedica] 
    select  @id_NegotiationTabColmedica,ts.idSpeciality,ma.idMedicalAct,ntti.idTypeIncrement,ma.code,ma.code,ma.code,1,
    ntb.idTypeFareGamaAltaU,
    CAST(REPLACE((fs.fare + (ntb.fareGamaAltaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaAltaA
    ,CAST(REPLACE((fs.fare + (ntb.fareHumanOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaHumanaA
    ,CAST(REPLACE((fs.fare + (ntb.fareGamaMediaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMediaA
    ,CAST(REPLACE((fs.fare + (ntb.fareGamaMenorOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMenorA
    ,CAST(REPLACE((fs.fare + (ntb.farePreferenciaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaPreferencialA
    ,ntb.idTypeFareGamaAltaU
    ,ntb.idTypeFareGamaAltaU,CAST(REPLACE((fs.fare + (ntb.fareGamaAltaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaAltaA
    ,CAST(REPLACE((fs.fare + (ntb.fareHumanOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaHumanaH
    ,CAST(REPLACE((fs.fare + (ntb.fareGamaMediaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMediaH
    ,CAST(REPLACE((fs.fare + (ntb.fareGamaMenorOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaMenorH
    ,CAST(REPLACE((fs.fare + (ntb.farePreferenciaOperation/100)*fs.fare), ',', '') AS DECIMAL(10, 2)) AS PrecioGamaPreferencialH
    from TB_NegotiationTabServiceColmedica as ntb
    inner join TB_Speciality as ts on ntb.idSpeciality = ts.idSpeciality
    inner join TB_MedicalAct as ma on ma.idSpeciality = ts.idSpeciality
    inner join TB_FareSoat  as fs on fs.idMedicalAct = ma.idMedicalAct
    inner join TB_NegotiationTabTypeIncrement as ntti on ntti.id_NegotiationTabColmedica = ntb.id_NegotiationTabColmedica
    inner join TB_ClasificationTypeServiceSpeciality as cts on cts.idSpeciality = ts.idSpeciality
    inner join TB_ClasificationTypeService as ct on ct.idClasificationTypeService = cts.idClasificationTypeService
    where ntb.id_NegotiationTabColmedica = @id_NegotiationTabColmedica and ntti.idTypeIncrement = 2
  `;

    const request = db.request();
    request.input("id_NegotiationTabColmedica", id_NegotiationTabColmedica);


    await request.query(insertQuery);
    await request.query(insertQuery2);
    await request.query(insertQuery3);



    return {
      code: 200,
      message: "ok",
      data: "ok",
    };
  } catch (err: any) {
    console.error("Error in saveLogicNegotiationTabCupsColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "saveLogicNegotiationTabCupsColmedica" },
      },
    };
  }
};


export const saveNegotiationTabServiceColmedicaColmedica = async (
  negotiationTabColmedica: INegotiationTabServiceColmedica
): Promise<IresponseRepositoryService> => {
  try {

    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryPlans = `
  INSERT INTO [dbo].[TB_NegotiationTabServiceColmedica]
           ([id_NegotiationTabColmedica]
           ,[idSpeciality]
           ,[idTypeService]
           ,[idTypeFareGamaAltaU]
           ,[fareGamaAltaOperation]
           ,[idTypeFareGamaAltaD]
           ,[idTypeFareHumanAltaU]
           ,[fareHumanOperation]
           ,[idTypeFareHumanD]
           ,[idTypeFareGamaMediaU]
           ,[fareGamaMediaOperation] 
           ,[idTypeFareGamaMediaD]
           ,[idTypeFareGamaMenorU]
           ,[fareGamaMenorOperation]
           ,[idTypeFareGamaMenorD]
           ,[idTypeFarePreferencialU]
           ,[farePreferenciaOperation]
           ,[idTypeFarePreferenciaD])
     OUTPUT inserted.*
     VALUES
           (@id_NegotiationTabColmedica,
           @idSpeciality,
           @idTypeService,
           @idTypeFareGamaAltaU,
           @fareGamaAltaOperation,
           @idTypeFareGamaAltaD,
           @idTypeFareHumanAltaU,
           @fareHumanOperation,
           @idTypeFareHumanD,
           @idTypeFareGamaMediaU,
           @fareGamaMediaOperation,
           @idTypeFareGamaMediaD,
           @idTypeFareGamaMenorU,
           @fareGamaMenorOperation,
           @idTypeFareGamaMenorD,
           @idTypeFarePreferencialU,
           @farePreferenciaOperation,
           @idTypeFarePreferenciaD)
  `;

    const request = db.request();
    request.input("id_NegotiationTabColmedica", negotiationTabColmedica.id_NegotiationTabColmedica);
    request.input("idSpeciality", negotiationTabColmedica.idSpeciality);
    request.input("idTypeService", negotiationTabColmedica.idTypeService);
    request.input("idTypeFareGamaAltaU", negotiationTabColmedica.idTypeFareGamaAltaU);
    request.input("fareGamaAltaOperation", negotiationTabColmedica.fareGamaAltaOperation);
    request.input("idTypeFareGamaAltaD", negotiationTabColmedica.idTypeFareGamaAltaD);
    request.input("idTypeFareHumanAltaU", negotiationTabColmedica.idTypeFareHumanAltaU);
    request.input("fareHumanOperation", negotiationTabColmedica.fareHumanOperation);
    request.input("idTypeFareHumanD", negotiationTabColmedica.idTypeFareHumanD);
    request.input("idTypeFareGamaMediaU", negotiationTabColmedica.idTypeFareGamaMediaU);
    request.input("fareGamaMediaOperation", negotiationTabColmedica.fareGamaMediaOperation);
    request.input("idTypeFareGamaMediaD", negotiationTabColmedica.idTypeFareGamaMediaD);
    request.input("idTypeFareGamaMenorU", negotiationTabColmedica.idTypeFareGamaMenorU);
    request.input("fareGamaMenorOperation", negotiationTabColmedica.fareGamaMenorOperation);
    request.input("idTypeFareGamaMenorD", negotiationTabColmedica.idTypeFareGamaMenorD);
    request.input("idTypeFarePreferencialU", negotiationTabColmedica.idTypeFarePreferencialU);
    request.input("farePreferenciaOperation", negotiationTabColmedica.farePreferenciaOperation);
    request.input("idTypeFarePreferenciaD", negotiationTabColmedica.idTypeFarePreferenciaD);

    const result = await request.query(queryPlans);

    if (!result.recordset || result.recordset.length === 0) {
      throw new Error("Failed to insert and retrieve the record");
    }

    const insertedRecord = result.recordset[0];

    return {
      code: 200,
      message: "ok",
      data: insertedRecord,
    };
  } catch (err: any) {
    console.error("Error in saveNegotiationTabColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "saveNegotiationTabColmedica" },
      },
    };
  }
};


export const saveNegotiationTabFareBaseColmedica = async (
  negotiationTabColmedica: ISaveNegotiationTabFareBaseColmedica
): Promise<IresponseRepositoryService> => {
  try {
    const { idNegotiationTabColmedica, idTypeFare } = negotiationTabColmedica;
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryPlans = `
      INSERT INTO [dbo].[TB_NegotiationTabFareBaseColmedica]
        ([idNegotiationTabColmedica]
        ,[idTypeFare])
      OUTPUT inserted.*
      VALUES
        (@idNegotiationTabColmedica,
         @idTypeFare)
    `;

    const insertedRecords = [];

    for (const fare of idTypeFare) {
      const request = db.request();
      request.input("idNegotiationTabColmedica", idNegotiationTabColmedica);
      request.input("idTypeFare", fare);

      const result = await request.query(queryPlans);

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error("Failed to insert and retrieve the record");
      }

      insertedRecords.push(result.recordset[0]);
    }

    return {
      code: 200,
      message: "ok",
      data: insertedRecords,
    };
  } catch (err: any) {
    console.error("Error in saveNegotiationTabColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "saveNegotiationTabColmedica" },
      },
    };
  }
};




export const saveNegotiationTabPlansColmedica = async (
  negotiationTabColmedica: INegotiationTabPlansColmedica
): Promise<IresponseRepositoryService> => {
  try {
    const { idNegotiationTabColmedica, idPlan, idTypeService } = negotiationTabColmedica;
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryPlans = `
      INSERT INTO [dbo].[TB_NegotiationTabPlansColmedica]
        ([idNegotiationTabColmedica]
        ,[idPlan]
        ,[idTypeService])
      OUTPUT inserted.*
      VALUES
        (@idNegotiationTabColmedica
        ,@idPlan
        ,@idTypeService)
    `;

    const insertedRecords = [];

    for (let i = 0; i < idTypeService.length; i++) {
      const typeService = idTypeService[i];
      const plansForService = idPlan[i];

      for (const plan of plansForService) {
        const request = db.request();
        request.input("idNegotiationTabColmedica", idNegotiationTabColmedica);
        request.input("idPlan", plan);
        request.input("idTypeService", typeService);

        const result = await request.query(queryPlans);

        if (!result.recordset || result.recordset.length === 0) {
          throw new Error("Failed to insert and retrieve the record");
        }

        insertedRecords.push(result.recordset[0]);
      }
    }

    return {
      code: 200,
      message: "ok",
      data: insertedRecords,
    };
  } catch (err: any) {
    console.error("Error in saveNegotiationTabColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "saveNegotiationTabColmedica" },
      },
    };
  }
};

export const saveNegotiationTabRendomColmedica = async (
  negotiationTabColmedica: INegotiationTabRendomColmedica
): Promise<IresponseRepositoryService> => {
  try {
    const { id_NegotiationTabColmedica, idTypeRendom, idTypeService } = negotiationTabColmedica;
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryPlans = `
      INSERT INTO [dbo].[TB_NegotiationTabRendomColmedica]
        ([id_NegotiationTabColmedica]
        ,[idTypeRendom]
        ,[idTypeService])
      OUTPUT inserted.*
      VALUES
        (@id_NegotiationTabColmedica
        ,@idTypeRendom
        ,@idTypeService)
    `;

    const insertedRecords = [];

    for (let i = 0; i < idTypeRendom.length; i++) {
      const typeRendom = idTypeRendom[i];
      const servicesForRendom = idTypeService[i];

      for (const service of servicesForRendom) {
        const request = db.request();
        request.input("id_NegotiationTabColmedica", id_NegotiationTabColmedica);
        request.input("idTypeRendom", typeRendom);
        request.input("idTypeService", service);

        const result = await request.query(queryPlans);

        if (!result.recordset || result.recordset.length === 0) {
          throw new Error("Failed to insert and retrieve the record");
        }

        insertedRecords.push(result.recordset[0]);
      }
    }

    return {
      code: 200,
      message: "ok",
      data: insertedRecords,
    };
  } catch (err: any) {
    console.error("Error in saveNegotiationTabColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "saveNegotiationTabColmedica" },
      },
    };
  }
};

export const saveNegotiationTabTypeIncrementColmedica = async (
  negotiationTabColmedica: INegotiationTabTypeIncrementColmedica
): Promise<IresponseRepositoryService> => {
  try {
    const { id_NegotiationTabColmedica, idTypeIncrement, valueIncrement } = negotiationTabColmedica;
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryIncrements = `
      INSERT INTO [dbo].[TB_NegotiationTabTypeIncrement]
        ([id_NegotiationTabColmedica]
        ,[idTypeIncrement]
        ,[valueIncrement])
      OUTPUT inserted.*
      VALUES
        (@id_NegotiationTabColmedica
        ,@idTypeIncrement
        ,@valueIncrement)
    `;

    const insertedRecords = [];

    for (let i = 0; i < idTypeIncrement.length; i++) {
      const typeIncrement = idTypeIncrement[i];
      const incrementValue = valueIncrement[i];

      const request = db.request();
      request.input("id_NegotiationTabColmedica", id_NegotiationTabColmedica);
      request.input("idTypeIncrement", typeIncrement);
      request.input("valueIncrement", incrementValue);

      const result = await request.query(queryIncrements);

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error("Failed to insert and retrieve the record");
      }

      insertedRecords.push(result.recordset[0]);
    }

    return {
      code: 200,
      message: "ok",
      data: insertedRecords,
    };
  } catch (err: any) {
    console.error("Error in saveNegotiationTabTypeIncrementColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "saveNegotiationTabTypeIncrementColmedica" },
      },
    };
  }
};

export const updateNegotiationTabServiceColmedica = async (
  negotiationTabColmedica: Partial<IUpdateNegotiationTabServiceColmedica>
): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    if (!negotiationTabColmedica.id_NegotiationTabColmedica || !negotiationTabColmedica.idSpeciality) {
      throw new Error("id_NegotiationTabColmedica and idSpeciality are required for update");
    }

    console.log("Received fields for update:", negotiationTabColmedica);

    let queryUpdate = `
      UPDATE [dbo].[TB_NegotiationTabServiceColmedica]
      SET `;
    const updates: string[] = [];
    const params: { [key: string]: any } = {};

    // Construye dinámicamente los campos a actualizar
    for (const key in negotiationTabColmedica) {
      if (key !== "id_NegotiationTabColmedica" && key !== "idSpeciality") {
        updates.push(`[${key}] = @${key}`);
        params[key] = (negotiationTabColmedica as any)[key];
      }
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    queryUpdate += updates.join(", ") + `
      WHERE [id_NegotiationTabColmedica] = @id_NegotiationTabColmedica
      AND [idSpeciality] = @idSpeciality
      SELECT * FROM [dbo].[TB_NegotiationTabServiceColmedica]
      WHERE [id_NegotiationTabColmedica] = @id_NegotiationTabColmedica
      AND [idSpeciality] = @idSpeciality
    `;

    const request = db.request();
    request.input("id_NegotiationTabColmedica", negotiationTabColmedica.id_NegotiationTabColmedica);
    request.input("idSpeciality", negotiationTabColmedica.idSpeciality);

    // Añade los parámetros dinámicamente
    for (const param in params) {
      request.input(param, params[param]);
    }

    const result = await request.query(queryUpdate);

    if (!result.recordset || result.recordset.length === 0) {
      throw new Error("Failed to update and retrieve the record");
    }

    const updatedRecord = result.recordset[0];

    return {
      code: 200,
      message: "ok",
      data: updatedRecord,
    };
  } catch (err: any) {
    console.error("Error in updateNegotiationTabServiceColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "updateNegotiationTabServiceColmedica" },
      },
    };
  }
};



export const getProvidersColmedica = async (idProvider: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    select distinct p.idProvider,p.razonSocial + ' ' + identificacion as razonSocial from TB_Provider as p
    inner join TB_OfficeProvider as op on op.idProvider = p.idProvider
    inner join TB_OfficeProviderClientHoneSolution as opch on opch.idOfficeProvider = op.idOfficeProvider
    where idClientHoneSolutions = 9 AND @idProvider IS NULL OR op.idProvider = @idProvider;
    `;

    const request = db.request();
    request.input('idProvider', idProvider || null);

    const result = await request.query(queryProviders);

    const providers: IProviderColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getProvidersColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getProvidersColmedica" },
      },
    };
  }
};


export const getInfoOfficeProvider = async (idProvider: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    select distinct op.idOfficeProvider,op.OfficeProviderName as clientColmedica from TB_Provider as p
    inner join TB_OfficeProvider as op on op.idProvider = p.idProvider
    inner join TB_OfficeProviderClientHoneSolution as opch on opch.idOfficeProvider = op.idOfficeProvider
    where idClientHoneSolutions = 9 and p.idProvider = @idProvider;
    `;

    const request = db.request();
    request.input('idProvider', idProvider || null);

    const result = await request.query(queryProviders);

    const providers: IProviderColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getInfoOfficeProvider", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getInfoOfficeProvider" },
      },
    };
  }
};


export const getOfficeProvidersColmedica = async (idOfficeProvider: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
     select distinct idOfficeProvider,o.razonSocial,op.OfficeProviderName,td.typeDocument,o.identificacion,d.departament,c.city,
     op.address  from TB_OfficeProvider as op
     inner join TB_Provider as o on o.idProvider = op.idProvider
     inner join TB_typeDocument as td on td.idTypeDocument = o.idTypeDocument
     inner join TB_Department as d on op.idDepartament = d.idDepartament 
     inner join TB_City as c on c.idCity = op.idCity
     inner join TB_ContactsProvider as cp on cp.idProvider = o.idProvider
     where op.idOfficeProvider =  ISNULL(@idOfficeProvider,op.idOfficeProvider)
    `;

    const inputIdOfficeProvider = idOfficeProvider !== undefined ? idOfficeProvider : null;

    const request = db.request();
    request.input('idOfficeProvider', inputIdOfficeProvider);

    const result = await request.query(queryProviders);

    const providers: IOfficeProviderColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getOfficeProvidersColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getOfficeProvidersColmedica" },
      },
    };
  }
};


export const getContactsProviderColmedica = async (idProvider: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
      SELECT co.idContactsProvider, co.name, co.SurName, oc.idOccupation, oc.occupation, co.phone, co.email, co.idProvider
      FROM TB_ContactsProvider AS co
      LEFT JOIN TB_Occupation AS oc ON oc.idOccupation = co.idOccupation
      WHERE (@idProvider IS NULL OR co.idProvider = @idProvider)
    `;

    const inputIdOfficeProvider = idProvider !== undefined ? idProvider : null;

    const request = db.request();
    request.input('idProvider', inputIdOfficeProvider);

    const result = await request.query(queryProviders);

    const providers: IContactsProviderColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getContactsProviderColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getContactsProviderColmedica" },
      },
    };
  }
};


export const getProductColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
      select * from TB_Product
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: IProductColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getProductColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getProductColmedica" },
      },
    };
  }
};



export const getTypeServiceColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    SELECT * FROM TB_TypeService WHERE idTypeService != 3
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: IProductColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getProductColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getProductColmedica" },
      },
    };
  }
};


export const getReferenceRateColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    	SELECT idTypeFare,typeFare  FROM TB_TypeFares
	 --select ntf.idTypeFare,typeFare from TB_NegotiationTabFareBaseColmedica as ntf
   --inner join TB_TypeFares as tf on tf.idTypeFare = ntf.idTypeFare
   --where idNegotiationTabColmedica =
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: IProductColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getProductColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getProductColmedica" },
      },
    };
  }
};

export const getNegotiationTabColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    SELECT 
    offi.OfficeProviderName,
    pr.Product,
    ne.dateBegin,
    ne.dateEnd,
    CASE 
        WHEN ne.dateEnd < GETDATE() THEN 'vencida'
        ELSE 'vigente'
    END AS Estado
    FROM 
        TB_NegotiationTabColmedica AS ne
    INNER JOIN 
        TB_OfficeProvider AS offi ON offi.idOfficeProvider = ne.idOfficeProvider
    INNER JOIN 
        TB_Product AS pr ON pr.idProduct = ne.idProduct
    ORDER BY ne.idProduct DESC
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: IProductColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getProductColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getProductColmedica" },
      },
    };
  }
};



export const getOccupationColmedica = async (idOccupation: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
      SELECT * FROM TB_Occupation WHERE (@idOccupation IS NULL OR idOccupation = @idOccupation)
    `;

    const inputIdOccupation = idOccupation !== undefined ? idOccupation : null;

    const request = db.request();
    request.input('idOccupation', inputIdOccupation);

    const result = await request.query(queryProviders);

    const providers: IOccupationColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getContactsProviderColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getContactsProviderColmedica" },
      },
    };
  }
};



export const getServicesColmedica = async (idClasificationTypeService: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
  	  select s.idSpeciality,s.speciality,* from TB_ClasificationTypeServiceSpeciality as ct
      inner join TB_Speciality as s on s.idSpeciality = ct.idSpeciality
      inner join TB_SpecialityClientHoneSolutions as sch on sch.idSpeciality = s.idSpeciality
      where ct.idClasificationTypeService = @idClasificationTypeService and sch.idClientHoneSolutions = 9
    `;

    const inputIdClasificationTypeService = idClasificationTypeService !== undefined ? idClasificationTypeService : null;

    const request = db.request();
    request.input('idClasificationTypeService', inputIdClasificationTypeService);

    const result = await request.query(queryProviders);

    const providers: IOccupationColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getContactsProviderColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getContactsProviderColmedica" },
      },
    };
  }
};



export const getInfoLogicColmedica = async (id_NegotiationTabColmedica: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
      select ct.clasificationTypeService as 'AGRUPADOR', s.speciality as 'SUBAGRUPADOR', ntcc.codigoCups, ntcc.codigoIPS, ntcc.codigoISS, ma.medicalAct as 'DESCRIPCION CUPS', 
      contratado, Iss2001uvrUvrOTarifa, ti.TypeIncrement, ntti.valueIncrement, tf.typeFare as 'typeFare1', fareGamaAltaA, fareGamaHumanaA, fareGamaMediaA, fareGamaMenorA, farePreferencialA,
      tfd.typeFare as 'typeFare2', fareGamaAltaA as 'fareGamaAltaA2', fareGamaHumanaA as 'fareGamaHumanaA2', fareGamaMediaA as 'fareGamaMediaA2', fareGamaMenorA as 'fareGamaMenorA2', farePreferencialA as 'farePreferencialA2'
      from TB_NegotiationTabCupsColmedica as ntcc
      left join TB_NegotiationTabTypeIncrement as ntti on ntti.id_NegotiationTabColmedica = ntcc.id_NegotiationTabColmedica
      left join TB_Speciality as s on s.idSpeciality = ntcc.idSpeciality
      left join TB_MedicalAct as ma on ma.idSpeciality = s.idSpeciality
      left join TB_TypeIncrement as ti on ti.idTypeIncrement = ntti.idTypeIncrement
      left join TB_TypeFares as tf on tf.idTypeFare = idTypeFareReferenceA
      left join TB_TypeFares as tfd on tfd.idTypeFare = idTypeFareReferenceH
      left join TB_ClasificationTypeServiceSpeciality as cts on cts.idSpeciality = s.idSpeciality
      left join TB_ClasificationTypeService as ct on ct.idClasificationTypeService = cts.idClasificationTypeService
      where ntcc.id_NegotiationTabColmedica = @id_NegotiationTabColmedica
    `;

    const inputIdNegotiationTabColmedica = id_NegotiationTabColmedica !== undefined ? id_NegotiationTabColmedica : null;

    const request = db.request();
    request.input('id_NegotiationTabColmedica', inputIdNegotiationTabColmedica);

    const result = await request.query(queryProviders);

    const providers = result.recordset.map(record => ({
      AGRUPADOR: record.AGRUPADOR,
      SUBAGRUPADOR: record.SUBAGRUPADOR,
      codigoCups: record.codigoCups,
      codigoIPS: record.codigoIPS,
      codigoISS: record.codigoISS,
      'DESCRIPCION CUPS': record['DESCRIPCION CUPS'],
      contratado: record.contratado,
      Iss2001uvrUvrOTarifa: record.Iss2001uvrUvrOTarifa,
      TypeIncrement: record.TypeIncrement,
      valueIncrement: record.valueIncrement,
      typeFare1: record.typeFare1,
      fareGamaAltaA: record.fareGamaAltaA,
      fareGamaHumanaA: record.fareGamaHumanaA,
      fareGamaMediaA: record.fareGamaMediaA,
      fareGamaMenorA: record.fareGamaMenorA,
      farePreferencialA: record.farePreferencialA,
      typeFare2: record.typeFare2,
      fareGamaAltaA2: record.fareGamaAltaA2,
      fareGamaHumanaA2: record.fareGamaHumanaA2,
      fareGamaMediaA2: record.fareGamaMediaA2,
      fareGamaMenorA2: record.fareGamaMenorA2,
      farePreferencialA2: record.farePreferencialA2,
    }));

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getContactsProviderColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getContactsProviderColmedica" },
      },
    };
  }
};


export const getInfoLogicTableColmedica = async (id_NegotiationTabColmedica: string | any | undefined): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    select clasificationTypeService,ts.speciality,tsd.typeService,
    tfga.typeFare + ' +' + CAST(ntb.fareGamaAltaOperation AS VARCHAR(20)) + '% ' + isnull(tfgad.typeFare,'') as 'TARIFA GAMA ALTA',
    tfh.typeFare + ' +' + CAST(ntb.fareHumanOperation AS VARCHAR(20)) + '% ' + isnull(tfhd.typeFare,'') as 'TARIFA HUMANA (PLUS Y TRADICIONAL)', 
    tfm.typeFare + ' +' + CAST(ntb.fareGamaMediaOperation AS VARCHAR(20)) + '% ' + isnull(tfhd.typeFare,'') as 'TARIFA GAMA MEDIA',
    tfme.typeFare + ' +' + CAST(ntb.fareGamaMenorOperation AS VARCHAR(20)) + '% ' + isnull(tfmed.typeFare,'') as 'TARIFA GAMA MENOR',
    tfp.typeFare + ' +' + CAST(ntb.farePreferenciaOperation AS VARCHAR(20)) + '% ' + isnull(tfpd.typeFare,'') as 'TARIFA PREFERENCIAL' 
    from TB_NegotiationTabServiceColmedica as ntb
    left join TB_Speciality as ts on ntb.idSpeciality = ts.idSpeciality
    left join TB_ClasificationTypeServiceSpeciality as cts on cts.idSpeciality = ts.idSpeciality
    left join TB_ClasificationTypeService as ct on ct.idClasificationTypeService = cts.idClasificationTypeService
    left join TB_TypeService as tsd on tsd.idTypeService = ntb.idTypeService
    left join [TB_TypeFares] as tfga on tfga.idTypeFare = ntb.idTypeFareGamaAltaU
    left join [TB_TypeFares] as tfgad on tfgad.idTypeFare = ntb.idTypeFareGamaAltaD
    left join [TB_TypeFares] as tfh on tfh.idTypeFare = ntb.idTypeFareHumanAltaU
    left join [TB_TypeFares] as tfhd on tfhd.idTypeFare = ntb.idTypeFareHumanD
    left join [TB_TypeFares] as tfm on tfm.idTypeFare = ntb.idTypeFareGamaMediaU
    left join [TB_TypeFares] as tfmd on tfmd.idTypeFare = ntb.idTypeFareGamaMediaD
    left join [TB_TypeFares] as tfme on tfme.idTypeFare = ntb.idTypeFareGamaMenorU
    left join [TB_TypeFares] as tfmed on tfmed.idTypeFare = ntb.idTypeFareGamaMenorD
    left join [TB_TypeFares] as tfp on tfp.idTypeFare = ntb.idTypeFarePreferencialU
    left join [TB_TypeFares] as tfpd on tfpd.idTypeFare = ntb.idTypeFarePreferenciaD
    where id_NegotiationTabColmedica  = @id_NegotiationTabColmedica
    `;

    const inputIdNegotiationTabColmedica = id_NegotiationTabColmedica !== undefined ? id_NegotiationTabColmedica : null;

    const request = db.request();
    request.input('id_NegotiationTabColmedica', inputIdNegotiationTabColmedica);

    const result = await request.query(queryProviders);

    const providers: IOccupationColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getContactsProviderColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getContactsProviderColmedica" },
      },
    };
  }
};

export const getTypeFaresColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    SELECT * FROM TB_TypeFares WHERE idTypeFare in (15,5,1,6,18)
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: IPlansColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getPlansColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getPlansColmedica" },
      },
    };
  }
};



export const getTypeRendomColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
      SELECT * FROM TB_typeRendom
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: ITypeRendomColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getPlansColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getPlansColmedica" },
      },
    };
  }
};


export const getTypeIncrementColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
     SELECT  *  FROM TB_TypeIncrement
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: ITypeIncrementColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getTypeIncrementColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getTypeIncrementColmedica" },
      },
    };
  }
};



export const getClasificationTypeServiceColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
      select cts.idClasificationTypeService,clasificationTypeService from TB_ClasificationTypeService as cts
      inner join TB_ClasificationTypeServiceClientHoneSolutions as ctsch on cts.idClasificationTypeService = ctsch.idClasificationTypeService
      where ctsch.idClientHoneSolutions = 9
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: ITypeIncrementColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getTypeIncrementColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getTypeIncrementColmedica" },
      },
    };
  }
};




export const getPlansColmedica = async (): Promise<IresponseRepositoryService> => {
  try {
    const db = await connectToSqlServer();

    if (!db) {
      throw new Error("Database connection failed");
    }

    const queryProviders = `
    select p.idPlan,pr.PlansRange + ' ' + p.[plan] AS namePlan from TB_Plans as p
    inner join TB_PlansRangePlan as prp on prp.idPlan = p.idPlan
    inner join TB_PlansRange as pr on pr.idPlansRange = prp.idPlansRange
    where p.idClientHoneSolutions = 9
    `;

    const request = db.request();

    const result = await request.query(queryProviders);

    const providers: IPlansColmedica[] = result.recordset;

    return {
      code: 200,
      message: "ok",
      data: providers,
    };
  } catch (err: any) {
    console.error("Error in getPlansColmedica", err);
    return {
      code: 400,
      message: {
        translationKey: "global.error_in_repository",
        translationParams: { name: "getPlansColmedica" },
      },
    };
  }
};


