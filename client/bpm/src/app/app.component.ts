import { Component } from '@angular/core';
import { AuthService } from "./auth/services/auth.service";

@Component({
    selector: 'bpm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [AuthService]
})
export class AppComponent {
    title = 'bpm works!';

    constructor(public authService: AuthService) {
        //
    }
}
