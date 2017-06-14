import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from "../services/chat.service";
import { StorageService } from "../../global/services/storage.service";

@Component({
    selector: 'bpm-chat-contact',
    templateUrl: './chat-contact.component.html',
    styleUrls: ['./chat-contact.component.scss']
})
export class ChatContactComponent implements OnInit {
    connectionStatus = false;
    displayState = false;
    @Output() onUserClicked = new EventEmitter<any>();
    onlineLearners: any[] = [];

    constructor(private chatService: ChatService,
                public storageService: StorageService) {
    }

    ngOnInit() {
    }

    onHeaderClick() {
        this.displayState = !this.displayState;
    }

    onUserClick(onlineUser) {
        this.chatService.createOrGetRoom(onlineUser.user._id).then(room => {
            console.log(room);
            this.onUserClicked.emit(room);
        });
    }
}
