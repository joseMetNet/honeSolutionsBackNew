import { Sequelize } from "sequelize";
import "colors";
import config from "../config/config";
import * as sql from 'mssql';

const configSQL: sql.config = {
  user: config.user_server_sql,
  password: "13A132b17#",
  database: config.name_database_sql,
  server:config.server_name_sql,
  options: {
    encrypt: true,
  },
};

// Instancia de conexión para SQL
async function connectToSqlServer() {
  try {
    const pool = await sql.connect(configSQL); // Utiliza la configuración de SQL
    console.log('Conectado a SQL Server');

    return pool;
  } catch (err) {
    console.error('Error al conectar a SQL Server:', err);
  }
}



export { connectToSqlServer };
