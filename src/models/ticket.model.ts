import { DataTypes, Model, Sequelize } from "sequelize";
import config from "../config/config";
import { ITicketModel } from "../interface/ticket.interface";
import { connectionSequelizeSql } from "../DB/config"

class Ticket extends Model<ITicketModel> implements ITicketModel {
    public idTickets!: number;
    public codigoEmpleado!: string;
    public nombreSolicitud!: string;
    public nombreArchivo!: string;
    public rutaArchivo!: string;
    public linkurl!: string;
    public observaciones!: string;
    public fechaSolicitud!: string;
    public fechaMaxima!: string;
    public fechaEdicion!: string;
    public idTipoSolicitud!: number;
    public idUsuarios!: number;
    public idStatus!: number;
    public email!: string;
    public idClientHoneSolutions!: number;
}

Ticket.init({
    idTickets: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    codigoEmpleado: {
        type: DataTypes.STRING,
    },
    nombreSolicitud: {
        type: DataTypes.STRING,
    },
    nombreArchivo: {
        type: DataTypes.STRING,
    },
    rutaArchivo: {
        type: DataTypes.STRING,
    },
    linkurl: {
        type: DataTypes.STRING,
    },
    observaciones: {
        type: DataTypes.TEXT,
    },
    fechaSolicitud: {
        type: DataTypes.DATE,
    },
    fechaMaxima: {
        type: DataTypes.DATE,
    },
    fechaEdicion: {
        type: DataTypes.DATE,
    },
    idTipoSolicitud: {
        type: DataTypes.INTEGER,
        references: {
            model: config.db_table_name_type_request,
            key: "idTiposolicitud"
        }
    },
    idUsuarios: {
        type: DataTypes.INTEGER,
        references: {
            model: config.db_table_name_providers,
            key: "idProvider"
        }
    },
    idStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        references: {
            model: config.db_table_name_status,
            key: "idStatus",
        }
    },
    email: {
        type: DataTypes.STRING,
    },
    idClientHoneSolutions: {
        type: DataTypes.INTEGER,
        references: {
            model: config.db_table_name_client_hone,
            key: "idClientHoneSolutions"
        }
    },
},
    {
        sequelize: connectionSequelizeSql,
        modelName: config.db_table_name_ticket,
        timestamps: false,
        hasTrigger: true
    }
)

export default Ticket;