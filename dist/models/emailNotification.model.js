"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const config_2 = require("../DB/config");
class EmailNotification extends sequelize_1.Model {
}
EmailNotification.init({
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    idClientHone: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    sequelize: config_2.connectionSequelizeSql,
    modelName: config_1.default.db_table_name_email_notification,
    timestamps: false,
    hasTrigger: true
});
exports.default = EmailNotification;
//# sourceMappingURL=emailNotification.model.js.map