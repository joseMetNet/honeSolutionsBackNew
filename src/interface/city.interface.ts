export interface dataCity{
    idDepartamento?: number;
}

export interface CitiesRepositoryService {
    code: number,
    message: string| { translationKey: string },
    data?: any
}