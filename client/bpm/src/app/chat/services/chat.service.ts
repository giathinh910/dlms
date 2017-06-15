import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { Subject } from "rxjs/Subject";
import { StorageService } from "../../global/services/storage.service";
import { AuthHttp } from 'angular2-jwt';

declare const io: any;

@Injectable()
export class ChatService {
    private apiUrl = environment.apiUrl;

    private chatSocketUrl = environment.chatSocketUrl;
    private socket;

    private someLearnerMessages = new Subject<any>();
    someLearnerMessages$ = this.someLearnerMessages.asObservable();

    private messagesInRoom = new Subject<any>();
    messagesInRoom$ = this.messagesInRoom.asObservable();

    private socketStatus = new Subject<boolean>();
    socketStatus$ = this.socketStatus.asObservable();

    private initData = new Subject<any>();
    initData$ = this.initData.asObservable();

    private aLearnerComesOnline = new Subject<any>();
    aLearnerComesOnline$ = this.aLearnerComesOnline.asObservable();

    private aLearnerComesOffline = new Subject<any>();
    aLearnerComesOffline$ = this.aLearnerComesOffline.asObservable();

    constructor(private storageService: StorageService,
                private http: AuthHttp) {
        //
    }

    /* XHR
     ============================================================= */
    createOrGetRoom(learnerIdToChat: any): Promise<any> {
        return this.http
            .post(`${this.apiUrl}/rooms/create-or-get-direct-room`, {learnerIdToChat: learnerIdToChat})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred:', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    /* SOCKET
     ============================================================= */
    // Service message commands
    sendMessage(message) {
        this.socket.emit('agent says', message);
    }

    listenIoEvents() {
        this.socket = io(this.chatSocketUrl, {
            query: {
                token: this.storageService.getToken()
            }
        });

        const socket = this.socket;

        socket.on('connect', () => this.socketStatus.next(true));

        socket.on('disconnect', () => this.socketStatus.next(false));

        socket.on('respond init data for learner', (data) => this.initData.next(data));

        socket.on('a learner comes online', (data) => {
            socket.emit('a learner comes online', data);
            this.aLearnerComesOnline.next(data);
        });

        socket.on('a learner comes offline', (data) => {
            socket.emit('a learner comes offline', data);
            this.aLearnerComesOffline.next(data);
        });

        socket.on('learner says in room', (data) => this.messagesInRoom.next(data));

        socket.on('a learner says', (data) => this.someLearnerMessages.next(data));
    }

    emitRequestInitData() {
        this.socket.emit('request init data for learner');
    }

    emitLearnerWantToJoinRoom(roomId) {
        this.socket.emit('learner wants to join room', roomId);
    }

    emitLearnerSay(message) {
        this.socket.emit('learner says in room', message);
    }

    closeSocket() {
        this.socket.close();
    }

}
