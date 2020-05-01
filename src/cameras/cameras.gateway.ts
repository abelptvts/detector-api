import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../auth/JWTPayload';
import { CamerasService } from './cameras.service';
import { Camera } from './camera.entity';

@WebSocketGateway()
export class CamerasGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private connectedCameras;
    private connectedClientIds;
    private server: Server = null;

    constructor(
        private jwtService: JwtService,
        private camerasService: CamerasService,
    ) {
        this.connectedCameras = {};
        this.connectedClientIds = {};
    }

    afterInit(server: Server) {
        this.server = server;
    }

    async handleConnection(client: Socket) {
        const token = client.handshake.headers.authorization;
        try {
            const payload: JWTPayload = await this.jwtService.verifyAsync(
                token,
                { ignoreExpiration: true },
            );
            const camera = await this.camerasService.findById(
                payload.id as number,
            );

            if (camera === null) {
                client.disconnect();
                return;
            }

            await this.camerasService.setConnected(camera, true);
            this.connectedCameras[client.id] = camera;
            this.connectedClientIds[camera.id] = client.id;
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        console.log('disc');
        try {
            const camera: Camera = this.connectedCameras[client.id];
            await this.camerasService.setConnected(camera, false);
            delete this.connectedCameras[client.id];
            delete this.connectedClientIds[camera.id];
        } catch (e) {
            console.log(e);
        }
    }

    async toggleCamera(cameraId: number, enabled) {
        if (!(cameraId in this.connectedClientIds)) {
            return;
        }

        const client = this.server.sockets.connected[
            this.connectedClientIds[cameraId]
        ];

        client.emit('toggle', enabled);
    }
}
