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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKEY = void 0;
const config_1 = require("../DB/config");
const genAPIKey = () => {
    // Crear una cadena base-36 que contenga 30 caracteres de a-z, 0-9
    return [...Array(30)].map(() => ((Math.random() * 50) | 0).toString(36)).join('');
};
const validateApiKEY = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = req.header("x-api-key");
        if (!apiKey) {
            return res.status(401).json({
                msg: "No tienes acceso a la url",
            });
        }
        const db = yield (0, config_1.connectToSqlServer)();
        const query = `SELECT * FROM TB_ApiKeys WHERE apiKey = @apiKey`;
        const result = yield (db === null || db === void 0 ? void 0 : db.request().input('apiKey', apiKey).query(query));
        if ((result === null || result === void 0 ? void 0 : result.recordset.length) === 0) {
            return res.status(401).json({
                msg: "Usuario sin permisos para acceder a la url",
            });
        }
        next();
    }
    catch (error) {
        console.error("Error al validar la apiKey:", error);
        return res.status(500).json({
            msg: "Error al validar la apiKey",
        });
    }
});
exports.validateApiKEY = validateApiKEY;
//# sourceMappingURL=validate-apikey.js.map