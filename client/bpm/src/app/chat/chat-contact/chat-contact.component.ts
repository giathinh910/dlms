import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'bpm-chat-contact',
    templateUrl: './chat-contact.component.html',
    styleUrls: ['./chat-contact.component.scss']
})
export class ChatContactComponent implements OnInit {
    displayState = false;

    @Output() onUserClicked = new EventEmitter<any>();

    onlineUsers: any[] = [
        {
            _id: 1,
            displayName: 'Donald Trump',
            online: true
        },
        {
            _id: 2,
            displayName: 'Barrack Obama',
            online: false
        },
        {
            _id: 3,
            displayName: 'George Bush',
            online: false
        },
        {
            _id: 4,
            displayName: 'Donald Trump',
            online: true
        },
        {
            _id: 5,
            displayName: 'Barrack Obama',
            online: false
        },
        {
            _id: 6,
            displayName: 'George Bush',
            online: false
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    onHeaderClick() {
        this.displayState = !this.displayState;
    }

    onUserClick(user) {
        this.onUserClicked.emit(user);
    }
}
