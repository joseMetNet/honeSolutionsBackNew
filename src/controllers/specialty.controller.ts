import { RequestHandler} from "express";
import { SpecialitiesRepositoryService } from "../interface/specialty.interface";
import * as repository from "../repository/specialty.repository";
import { parseMessageI18n } from "../utils/parse-messga-i18";

export const getSpecialtiesBolivar: RequestHandler = async (req, res) => {
    try {
        const { code, message, ...resto }: SpecialitiesRepositoryService = await repository.getSpecialtiesBolivar(req.query);
        res.status(code).json({ message: parseMessageI18n(message, req), ...resto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: parseMessageI18n('error_server', req) });
    }
};