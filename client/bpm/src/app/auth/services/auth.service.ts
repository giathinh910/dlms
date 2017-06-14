import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import { tokenNotExpired } from "angular2-jwt";
import { StorageService } from "../../global/services/storage.service";
import { Router } from "@angular/router";
import { ChatService } from "../../chat/services/chat.service";

@Injectable()
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http,
                private storageService: StorageService,
                private router: Router,
                private chatService: ChatService) {
        //
    }

    login(credentials: any) {
        const url = `${this.apiUrl}/login`;
        return this.http.post(url, JSON.stringify(credentials), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    register(credentials: any) {
        const url = `${this.apiUrl}/register`;
        return this.http.post(url, JSON.stringify(credentials), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    loggedIn() {
        return tokenNotExpired((this.storageService.getStorageKeys()).token, this.storageService.getToken());
    }

    logout() {
        this.storageService.clear();
        this.chatService.closeSocket();
        this.router.navigateByUrl('/login');
    }

    private handleError(error: any): Promise<any> {
        console.log('An error occurred:', error); // for demo purposes only
        // return;
        return Promise.reject(error.message || error);
    }

}
