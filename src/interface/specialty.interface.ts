export interface dataSpeciality {
    idCiudad?: number, 
    idDepartamento?: number, 
    idPlan?: number
}

export interface SpecialitiesRepositoryService {
    code: number,
    message: string| { translationKey: string },
    data?: any
}