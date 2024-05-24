import { Schema } from "express-validator";

export const CreateTicketSchema: Schema = {
    requestName: {
        notEmpty: true,
        isString: true,
        errorMessage: "requestName is required"
    },
    employeeCode: {
        notEmpty: true,
        isString: true,
        errorMessage: "employeeCode is required"
    },
    description: {
        notEmpty: true,
        isString: true,
        errorMessage: "description is required"
    },
    typeRequest: {
        notEmpty: true,
        isNumeric: true,
        errorMessage: "typeRequest is required"
    },
    userId: {
        notEmpty: true,
        isNumeric: true,
        errorMessage: "userId is required"
    },
    email: {
        notEmpty: true,
        isString: true,
        errorMessage: "email is required"
    },
    idClientHone: {
        notEmpty: true,
        isNumeric: true,
        errorMessage: "idClientHone is required"
    },
    requestDate: {
        notEmpty: true,
        isDate: true,
        errorMessage: "requestDate is required"
    },
    maxDate: {
        notEmpty: true,
        isDate: true,
        errorMessage: "maxDate is required"
    },
    idRole: {
        notEmpty: true,
        isNumeric: true,
        errorMessage: "idRole is required"
    }
}