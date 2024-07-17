"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicket = void 0;
const config_1 = __importDefault(require("../config/config"));
const ticket_model_1 = __importDefault(require("../models/ticket.model"));
const emailNotification_model_1 = __importDefault(require("../models/emailNotification.model"));
const html_template_1 = require("./templates/ticket/html.template");
const createTicket = (request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = prepareData(request);
        const ticket = yield ticket_model_1.default.create(data);
        const recordEmail = yield emailNotification_model_1.default.findOne({ where: { idClientHone: ticket.idClientHoneSolutions } });
        const adminEmail = yield emailNotification_model_1.default.findOne({ where: { idClientHone: 7 } });
        if (recordEmail) {
            yield sendEmail(request.idRole, recordEmail.email, ticket);
        }
        if (adminEmail) {
            yield sendEmail(request.idRole, adminEmail.email, ticket);
        }
        return {
            code: 200,
            message: { translationKey: "ticket.successful" },
            data: ""
        };
    }
    catch (err) {
        console.error("Error: ", err);
        return {
            code: 400,
            message: { translationKey: "ticket.error_server", translationParams: { name: "createTicket" } },
        };
    }
});
exports.createTicket = createTicket;
const sendEmail = (idRole, email, ticket) => __awaiter(void 0, void 0, void 0, function* () {
    const template = getTemplate(idRole, ticket);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${config_1.default.email_token}`
        },
        body: JSON.stringify({
            Subject: "Nuevo Ticket Registrado",
            From: `Hone Solutions<${config_1.default.email_from}>`,
            Template: {
                Type: "text/html",
                Value: template
            },
            Recipients: [{ To: `Admin HoneSolutions<${email}>` }]
        })
    };
    try {
        const response = yield fetch(config_1.default.email_host, options);
        const json = yield response.json();
        return json.status === 'ok';
    }
    catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
});
const getTemplate = (idRole, ticket) => {
    const newData = {
        idTickets: ticket === null || ticket === void 0 ? void 0 : ticket.idTickets,
        email: ticket === null || ticket === void 0 ? void 0 : ticket.email,
        observaciones: ticket === null || ticket === void 0 ? void 0 : ticket.observaciones
    };
    return (0, html_template_1.basicTemplate)(newData);
};
const prepareData = (request) => {
    return {
        linkurl: '',
        nombreSolicitud: request.requestName,
        codigoEmpleado: request.employeeCode,
        fechaSolicitud: formatDate(request.requestDate),
        fechaMaxima: formatDate(request.maxDate),
        observaciones: request.description,
        nombreArchivo: '',
        rutaArchivo: '',
        idTipoSolicitud: request.typeRequest,
        idUsuarios: request.userId,
        email: request.email,
        idClientHoneSolutions: request.idClientHone,
        userLoggedIn: request.userLogged
    };
};
const formatDate = (date = new Date()) => {
    const d = new Date(date);
    d.setUTCHours(d.getUTCHours() - 5);
    return d.toISOString().slice(0, 19).replace('T', ' ');
};
//# sourceMappingURL=ticket.repository.js.map