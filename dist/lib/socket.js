"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    console.log('📡 WebSocket Server Initialized');
    return io;
};
exports.initSocket = initSocket;
const broadcast = (event, payload) => {
    if (io) {
        io.emit(event, payload);
    }
};
exports.broadcast = broadcast;
