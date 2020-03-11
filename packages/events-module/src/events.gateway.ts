import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Server } from 'ws';
import { Socket } from 'net';
import { /* dd, */ dump } from 'dumper.js';
import { IncomingMessage } from 'http';
import { use, delegate } from 'typescript-mix';
import { v4 as uuid } from 'uuid';
import { getUniqleNumber } from '@beyond/utils';

/* Helper functions */
const getPlayerUID = () => this._id;
const isIdentifiable = (obj: any) => '__identifiable' in obj;
const isConnectable = (obj: any) => '__connectable' in obj;

/* ---- Mixins ---- */
class Identifiable {
  __identifiable: () => void;
  private _uid: number;
  uuid: string;
  get id(): number { return this._uid; }
  set id(value: number) { this._uid = value; }
  @delegate(getPlayerUID) getUID:() => void;
}

class Connectable {
  __connectable: () => void;
  private _socket: Socket;
  private _request: IncomingMessage;
  get socket() { return this._socket; }
  set socket(value: Socket) { this._socket = value; }
  get request() { return this._request }
  set request(value: IncomingMessage) { this._request = value; }
}

/* ---- Classes ---- */
interface Player extends Identifiable, Connectable {}
class Player {
  // mixins
  @use(Identifiable, Connectable) this
  constructor() {
    // 用來判定是否為 mixin
    this.__identifiable = () => false;
    this.__connectable = () => false;
  }
}

/**
 * 可用 WebSocketGateway 修飾器(Decorator) 修改 port 和傳輸方式
 * @WebSocketGateway(81, { transports: ['websocket'] })
 * 
 * @export
 * @class EventsGateway
 * @implements {OnGatewayInit}
 * @implements {OnGatewayConnection}
 * @implements {OnGatewayDisconnect}
 */
@WebSocketGateway(8080)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  /**
   * Websocket Server
   *
   * @type {Server}
   * @memberof EventsGateway
   */
  @WebSocketServer()
  server: Server;

  /**
   * Connections
   * 
   * @type {Map<string, Player>}
   * @memberof EventsGateway
   */
  clients: Map<string, Player>;
  
  /**
   * OnGatewayInit
   *
   * @param {Server} server
   * @returns {*}
   * @memberof EventsGateway
   */
  afterInit(server: Server): any {
    this.clients = new Map();
    console.log('websocket server listen at ' + server.options.port);
  }

  /**
   * OnGatewayConnection
   *
   * @param {Socket} client
   * @param {IncomingMessage} request
   * @returns {*}
   * @memberof EventsGateway
   */
  handleConnection(client: Socket, request: IncomingMessage): any {
    const newPlayer = new Player();
    newPlayer.uuid = uuid();
    newPlayer.id = getUniqleNumber();
    newPlayer.socket = client;
    newPlayer.request = request;
    
    this.clients.set(newPlayer.id.toString(), newPlayer);
    console.log(isIdentifiable(newPlayer), isConnectable(newPlayer));
    dump('new connection id: ' + newPlayer.id + ', palyers: '+ this.clients.size);
  }

  /**
   * OnGatewayDisconnect
   *
   * @param {Socket} client
   * @returns {*}
   * @memberof EventsGateway
   */
  handleDisconnect(client: Socket): any {
    // from(this.clients.entries())
    //   .pipe(map((item:any[]) => item[1])) // only values
    //   .pipe(filter((player: Player) => player.socket === client))
    //   .subscribe((player: Player) => {
    //     this.clients.delete(player.id) && dump('delete ' + player.id + ', players: ' + this.clients.size);
    //   });

    this.clients.forEach((player, key) => {
      if (player.socket === client) {
        // this.clients.has(player.id) && this.clients.delete(player.id);
        this.clients.delete(key);
        dump('delete ' + key + ', players: ' + this.clients.size);
      }
    });
  }

  /**
   * Handling events messages
   * 
   * 官網不建議用這種方式
   * onEvent(client: Socket, data: any): Observable<WsResponse<number>>
   *
   * @param {Socket} client
   * @param {*} data
   * @returns {Observable<WsResponse<number>>}
   * @memberof EventsGateway
   */
  @SubscribeMessage('events')
  onEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any
  ): Observable<WsResponse<number>> {
    // client: Websockeet
    console.log('message from client: ' + data);
    return from([1,2,3]).pipe(
      map(item => ({ event: 'events', data: item }))
    );
  }

}