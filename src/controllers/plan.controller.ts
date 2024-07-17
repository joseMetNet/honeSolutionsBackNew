import { RequestHandler} from "express";
import { PlansRepositoryService } from "../interface/plan.interface";
import * as repository from "../repository/plan.repository";
import { parseMessageI18n } from "../utils/parse-messga-i18";

export const getPlansBolivar: RequestHandler = async (req, res) => {
    try {
        const { code, message, ...resto }: PlansRepositoryService = await repository.getPlansBolivar(req.query);
        res.status(code).json({ message: parseMessageI18n(message, req), ...resto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: parseMessageI18n('error_server', req) });
    }
};