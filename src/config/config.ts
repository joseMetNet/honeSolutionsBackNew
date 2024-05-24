import dotEnv from "dotenv";
// utilizar variables de entorno
dotEnv.config();

export default {
    port: process.env.PORT  || "8080",
    email_host: "https://api.masiv.masivian.com/email/v1/delivery",
    email_token: "R2V0aW5jbG91ZC1NZXRuZXQuQXBpOjBrMmxnMkdFNlRYSA==",
    email_from: "gestiondocumental@honesolutions.com.co",
    server_name_sql: process.env.SERVER_NAME_SQL || "",
    user_server_sql: process.env.USER_SERVER_SQL || "",
    name_database_sql: process.env.NAME_DATABASE_SQL || "",
    db_table_name_ticket: "TB_tickets",
    db_table_name_email_notification: "TB_EmailNotificationByClient",
    db_table_name_type_request: "TB_Tipodesolicitud",
    db_table_name_providers: "TB_Provider",
    db_table_name_status: "TB_Status",
    db_table_name_client_hone: "TB_ClientHoneSolutions"
}