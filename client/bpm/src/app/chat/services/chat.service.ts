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

    private messages = new Subject<any>();
    messages$ = this.messages.asObservable();

    private socketStatus = new Subject<boolean>();
    socketStatus$ = this.socketStatus.asObservable();

    private initData = new Subject<any>();
    initData$ = this.initData.asObservable();

    private aCustomerComesOnline = new Subject<any>();
    aCustomerComesOnline$ = this.aCustomerComesOnline.asObservable();

    private aCustomerComesOffline = new Subject<any>();
    aCustomerComesOffline$ = this.aCustomerComesOffline.asObservable();

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
            this.aCustomerComesOnline.next(data);
        });

        socket.on('a learner comes offline', (data) => {
            socket.emit('a learner comes offline', data);
            this.aCustomerComesOffline.next(data);
        });

        socket.on('learner says', (data) => this.messages.next(data));
    }

    emitRequestInitData() {
        this.socket.emit('request init data for learner');
    }

    closeSocket() {
        this.socket.close();
    }

}
