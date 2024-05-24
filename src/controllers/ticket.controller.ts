import { RequestHandler} from "express";
import * as repository from "../repository/ticket.repository";
import { parseMessageI18n } from "../utils/parse-messga-i18";
import { IResponse, IResponseCreate } from "../interface/ticket.interface";

export const createTicket: RequestHandler = async (req, res) => {
    try {
        const { code, message, ...resto }: IResponse<IResponseCreate> = await repository.createTicket(req?.body);
        res.status(code).json({message: parseMessageI18n(message, req),  ...resto});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: parseMessageI18n('error_server', req) });
    }
};