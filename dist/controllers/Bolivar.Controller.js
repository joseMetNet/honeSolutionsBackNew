"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvidersBolivar = exports.getSpecialties = exports.getPlans = exports.getCities = exports.getDepartments = void 0;
const repository = __importStar(require("../repository/Bolivar.Repository"));
const parse_messga_i18_1 = require("../utils/parse-messga-i18");
const getDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = yield repository.getDepartments(), { code, message } = _a, resto = __rest(_a, ["code", "message"]);
        res.status(code).json(Object.assign({ message: (0, parse_messga_i18_1.parseMessageI18n)(message, req) }, resto));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: (0, parse_messga_i18_1.parseMessageI18n)('error_server', req) });
    }
});
exports.getDepartments = getDepartments;
const getCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _b = yield repository.getCities(req.query), { code, message } = _b, resto = __rest(_b, ["code", "message"]);
        res.status(code).json(Object.assign({ message: (0, parse_messga_i18_1.parseMessageI18n)(message, req) }, resto));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: (0, parse_messga_i18_1.parseMessageI18n)('error_server', req) });
    }
});
exports.getCities = getCities;
const getPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _c = yield repository.getPlans(req.query), { code, message } = _c, resto = __rest(_c, ["code", "message"]);
        res.status(code).json(Object.assign({ message: (0, parse_messga_i18_1.parseMessageI18n)(message, req) }, resto));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: (0, parse_messga_i18_1.parseMessageI18n)('error_server', req) });
    }
});
exports.getPlans = getPlans;
const getSpecialties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _d = yield repository.getSpecialties(req.query), { code, message } = _d, resto = __rest(_d, ["code", "message"]);
        res.status(code).json(Object.assign({ message: (0, parse_messga_i18_1.parseMessageI18n)(message, req) }, resto));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: (0, parse_messga_i18_1.parseMessageI18n)('error_server', req) });
    }
});
exports.getSpecialties = getSpecialties;
const getProvidersBolivar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _e = yield repository.getProvidersBolivar(req.query), { code, message } = _e, resto = __rest(_e, ["code", "message"]);
        res.status(code).json(Object.assign({ message: (0, parse_messga_i18_1.parseMessageI18n)(message, req) }, resto));
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: (0, parse_messga_i18_1.parseMessageI18n)('error_server', req) });
    }
});
exports.getProvidersBolivar = getProvidersBolivar;
//# sourceMappingURL=Bolivar.Controller.js.map