import Handlebars from "handlebars";
import config from "../config/config";
import { IRequestCreate, ITicketModel } from "../interface/ticket.interface";
import Ticket from "../models/ticket.model";
import fs from "fs";
import path from "path";
import EmailNotification from "../models/emailNotification.model";

export const createTicket = async (request: IRequestCreate) => {
    try {
        const data = prepareData(request);
        const ticket = await Ticket.create(data);
        const recordEmail = await EmailNotification.findOne({ where: { idClientHone: ticket.idClientHoneSolutions } });
        
        if (recordEmail) {
            await sendEmail(request.idRole, recordEmail.email, ticket);
        }

        return {
            code: 200,
            message: { translationKey: "ticket.successful" },
            data: ""
        };
    } catch (err: any) {
        console.error("Error: ", err);
        return {
            code: 400,
            message: { translationKey: "ticket.error_server", translationParams: { name: "createTicket" } },
        };
    }
};

const sendEmail = async (idRole: number, email: string, ticket?: Ticket): Promise<boolean> => {
    const template = getTemplate(idRole, ticket);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${config.email_token}`
        },
        body: JSON.stringify({
            Subject: "Nuevo Ticket Registrado",
            From: `Hone Solutions<${config.email_from}>`,
            Template: {
                Type: "text/html",
                Value: template
            },
            Recipients: [{ To: `Admin HoneSolutions<${email}>` }]
        })
    };

    try {
        const response = await fetch(config.email_host, options);
        const json = await response.json();
        return json.status === 'ok';
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

const getTemplate = (idRole: number, ticket?: Ticket): string => {
    const newData = {
        idTickets: ticket?.idTickets,
        email: ticket?.email,
        observaciones: ticket?.observaciones
    };
    
    const base_url = path.join(__dirname, 'templates/ticket');
    const fileTemplate = idRole === 10 
        ? path.join(base_url, 'role10.template.html') 
        : path.join(base_url, 'basic.template.html');

    const htmlTemplate = fs.readFileSync(fileTemplate, 'utf8');
    const template = Handlebars.compile(htmlTemplate);
    return template(newData);
};

const prepareData = (request: IRequestCreate): ITicketModel => {
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
    };
};

const formatDate = (date = new Date()): string => {
    const d = new Date(date);
    d.setUTCHours(d.getUTCHours() - 5);
    return d.toISOString().slice(0, 19).replace('T', ' ');
};