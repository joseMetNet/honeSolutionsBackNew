import config from "../config/config";
import { connectToSqlServer } from "../DB/config";
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import "colors";
import i18n from "../config/i18n";
import fileUpload from 'express-fileupload';

//routes
import Routes from "../routes/router.Router";
import RoutesTicket from "../routes/ticket.router";
import colmedica from "../routes/colmedica.router";


class Server {
  private app: Application;
  private port: string;
  private path: any;
  private base_url: string = "/api/honeSolutions";

  constructor() {
    this.app = express();
    this.port = config.port || '8080';
    this.path = {
      // exmple
      example: this.base_url,
      ticket: "/ticket",
      colmedica: "/colmedica",

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

  async conectarDB() {
    // concection of bd
    await connectToSqlServer();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // Directorio publico
    this.app.use(express.static("public"));
    // resposes json
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    // responses
    this.app.use(morgan("dev"));
    // subir archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
        limits: { fileSize: 50 * 1024 * 1024}
      })
    );
    // translator handler 
    this.app.use(i18n.init);
  }

  routes() {
    // example
    this.app.use(this.path.example, Routes);
    this.app.use(this.path.ticket, RoutesTicket);
    this.app.use(this.path.colmedica, colmedica);

  }

  listen() {
    console.clear();
    this.app.listen(this.port, () => {
      console.log(` 🔥 Server in port ${this.port}`.bold);
    });
  }
}

export default Server;
