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
const config_1 = __importDefault(require("../config/config"));
const config_2 = require("../DB/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("colors");
const i18n_1 = __importDefault(require("../config/i18n"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//routes
const router_Router_1 = __importDefault(require("../routes/router.Router"));
const ticket_router_1 = __importDefault(require("../routes/ticket.router"));
class Server {
    constructor() {
        this.base_url = "/api/honeSolutions";
        this.app = (0, express_1.default)();
        this.port = config_1.default.port || '8080';
        this.path = {
            // exmple
            example: this.base_url,
            ticket: "/ticket",
        };
        // Conectar a bd
        this.conectarDB();
        // Middlwares
        this.middlewares();
        // Mis rutas
        this.routes();
        // cors proteger nuestra api para que solo reciba peticiones de cierto lugar
        // listas blancas y listas negras
    }
    conectarDB() {
        return __awaiter(this, void 0, void 0, function* () {
            // concection of bd
            yield (0, config_2.connectToSqlServer)();
        });
    }
    middlewares() {
        // CORS
        this.app.use((0, cors_1.default)());
        // Directorio publico
        this.app.use(express_1.default.static("public"));
        // resposes json
        this.app.use(express_1.default.json());
        // responses
        this.app.use((0, morgan_1.default)("dev"));
        // subir archivos
        this.app.use((0, express_fileupload_1.default)({
            useTempFiles: true,
            tempFileDir: "/tmp/",
            createParentPath: true,
        }));
        // translator handler 
        this.app.use(i18n_1.default.init);
    }
    routes() {
        // example
        this.app.use(this.path.example, router_Router_1.default);
        this.app.use(this.path.ticket, ticket_router_1.default);
    }
    listen() {
        console.clear();
        this.app.listen(this.port, () => {
            console.log(` 🔥 Server in port ${this.port}`.bold);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map