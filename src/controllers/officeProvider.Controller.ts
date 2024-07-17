import { RequestHandler} from "express";
import * as repository from "../repository/officeProvider.repository";
import { parseMessageI18n } from "../utils/parse-messga-i18";
import { IresponseRepositoryService } from "../interface/officeProvider.Interface";

export const getProvidersBolivar: RequestHandler = async (req, res) => {
    try {
        const { code, message, ...resto }: IresponseRepositoryService = await repository.getProvidersBolivar(req.query);
        res.status(code).json({ message: parseMessageI18n(message, req), ...resto });        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: parseMessageI18n('error_server', req) });
    }
}