import { Server as SocketServer } from 'socket.io';

let io: SocketServer | null = null;

export const initSocket = (server: any) => {
    io = new SocketServer(server, { 
        cors: { 
            origin: "*",
            methods: ["GET", "POST"]
        },
        transports: ['polling', 'websocket']
    });
    console.log('📡 WebSocket Server Initialized (Polling + WebSocket supported)');
    return io;
};

export const broadcast = (event: string, payload: any) => {
    if (io) {
        io.emit(event, payload);
    }
};
