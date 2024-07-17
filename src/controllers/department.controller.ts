import { RequestHandler} from "express";
import { DepartmentsRepositoryService } from "../interface/department.interface";
import * as repository from "../repository/department.repository";
import { parseMessageI18n } from "../utils/parse-messga-i18";

export const getDepartmentsBolivar: RequestHandler = async (req, res) => {
    try {
        const { code, message, ...resto }: DepartmentsRepositoryService = await repository.getDepartmentsBolivar();
        res.status(code).json({message: parseMessageI18n(message, req),  ...resto});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: parseMessageI18n('error_server', req) });
    }
};