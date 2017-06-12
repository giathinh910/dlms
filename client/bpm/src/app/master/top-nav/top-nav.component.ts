import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/services/auth.service";
import { StorageService } from "../../global/services/storage.service";

@Component({
    selector: 'bpm-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss'],
    providers: [AuthService]
})
export class TopNavComponent implements OnInit {

    constructor(public authService: AuthService,
                public storageService: StorageService) {
    }

    ngOnInit() {
    }

}
