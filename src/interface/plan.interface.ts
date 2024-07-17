export interface dataPlan {
    idCiudad?: number
}

export interface PlansRepositoryService {
    code: number,
    message: string| { translationKey: string },
    data?: any
}