import { DataTypes, Model } from "sequelize";
import config from "../config/config";
import { connectionSequelizeSql } from "../DB/config"
import { IEmailNotificationModel } from "../interface/emailNotification.interface";

class EmailNotification extends Model<IEmailNotificationModel> implements IEmailNotificationModel {
    public email!: string;
    public idClientHone!: number;
}

EmailNotification.init({
    email: {
        type: DataTypes.STRING,
    },
    idClientHone: {
        type: DataTypes.INTEGER,
    },
},
    {
        sequelize: connectionSequelizeSql,
        modelName: config.db_table_name_email_notification,
        timestamps: false,
        hasTrigger: true
    }
)

export default EmailNotification;