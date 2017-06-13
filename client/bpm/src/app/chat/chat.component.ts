import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";

@Component({
    selector: 'bpm-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    chatUsers: any[] = [];

    constructor() {
    }

    ngOnInit() {
    }

    getSelectedUser(user) {
        const chatUserIndex = _.findIndex(this.chatUsers, function (chatUser) {
            return user._id === chatUser._id;
        });
        // only create new chat box if not existed
        if (chatUserIndex === -1) {
            // allow maximum 3 chat boxes
            if (this.chatUsers.length === 3) {
                this.chatUsers.splice(this.chatUsers.length - 1, 1);
                this.chatUsers.unshift(user);
            } else {
                this.chatUsers.push(user);
            }
        }
    }

    removeChatBox(user) {
        const chatUserIndex = _.findIndex(this.chatUsers, function (chatUser) {
            return user._id === chatUser._id;
        });
        this.chatUsers.splice(chatUserIndex, 1);
    }
}
