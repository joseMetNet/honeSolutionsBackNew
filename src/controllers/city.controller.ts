import { RequestHandler} from "express";
import { CitiesRepositoryService } from "../interface/city.interface";
import * as repository from "../repository/city.repository";
import { parseMessageI18n } from "../utils/parse-messga-i18";
export const getCitiesBolivar: RequestHandler = async (req, res) => {
    try {
        const { code, message, ...resto }: CitiesRepositoryService = await repository.getCitiesBolivar(req.query);
        res.status(code).json({ message: parseMessageI18n(message, req), ...resto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: parseMessageI18n('error_server', req) });
    }
};