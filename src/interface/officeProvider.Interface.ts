export interface ImessageComposed {
    translationKey: string,
    translationParams: object
}

export interface IresponseRepositoryService {
    code: number,
    message: string| { translationKey: string },
    data?: any,
    totalData?: number,
    totalPage?: number
}

export interface dataProvider  {
    idDepartamento?: string;
    idCiudad?: string;
    idPlan?: string;
    idEspecialidad?: string;
    nombreComercial?: string;
    tamano?: number;
    pagina?: number;
}



