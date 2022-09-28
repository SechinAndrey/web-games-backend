import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as config from 'config';

@WebSocketGateway(config.get('SOCKET_IO.PORT'), {
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('drw')
  handleMessage(client: any, payload: any) {
    this.server.emit('drw', payload);
  }
}
