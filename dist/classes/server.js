"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("../global/environment");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const Views = require('./schema/views');
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = environment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.listenSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    listenSockets() {
        console.log('Escuchando sockets');
        this.io.on('connection', client => {
            console.log('Cliente conectado');
            Views.findOne({ about: 'covidpage' }, (err, views) => {
                views.views = views.views + 1;
                console.log('Visitas: ', views.views);
                views.save();
            });
            client.on('disconnect', () => {
                console.log('Cliente desconectado');
            });
        });
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = Server;
