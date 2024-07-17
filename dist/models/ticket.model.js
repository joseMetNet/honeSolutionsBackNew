"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const config_2 = require("../DB/config");
class Ticket extends sequelize_1.Model {
}
Ticket.init({
    idTickets: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    codigoEmpleado: {
        type: sequelize_1.DataTypes.STRING,
    },
    nombreSolicitud: {
        type: sequelize_1.DataTypes.STRING,
    },
    nombreArchivo: {
        type: sequelize_1.DataTypes.STRING,
    },
    rutaArchivo: {
        type: sequelize_1.DataTypes.STRING,
    },
    linkurl: {
        type: sequelize_1.DataTypes.STRING,
    },
    observaciones: {
        type: sequelize_1.DataTypes.TEXT,
    },
    fechaSolicitud: {
        type: sequelize_1.DataTypes.DATE,
    },
    fechaMaxima: {
        type: sequelize_1.DataTypes.DATE,
    },
    fechaEdicion: {
        type: sequelize_1.DataTypes.DATE,
    },
    idTipoSolicitud: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: config_1.default.db_table_name_type_request,
            key: "idTiposolicitud"
        }
    },
    idUsuarios: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: config_1.default.db_table_name_providers,
            key: "idProvider"
        }
    },
    idStatus: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 5,
        references: {
            model: config_1.default.db_table_name_status,
            key: "idStatus",
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    idClientHoneSolutions: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: config_1.default.db_table_name_client_hone,
            key: "idClientHoneSolutions"
        }
    },
    userLoggedIn: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: config_1.default.db_table_name_providers,
            key: "idProvider"
        }
    },
}, {
    sequelize: config_2.connectionSequelizeSql,
    modelName: config_1.default.db_table_name_ticket,
    timestamps: false,
    hasTrigger: true
});
exports.default = Ticket;
//# sourceMappingURL=ticket.model.js.map