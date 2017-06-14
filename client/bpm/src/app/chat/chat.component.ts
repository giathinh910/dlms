import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import * as _ from "lodash";
import { ChatService } from "./services/chat.service";
import { ChatContactComponent } from "./chat-contact/chat-contact.component";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { AuthService } from "../auth/services/auth.service";

@Component({
    selector: 'bpm-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [AuthService]
})
export class ChatComponent implements OnInit {
    @ViewChild(ChatContactComponent) private chatContact: ChatContactComponent;
    @ViewChildren(ChatBoxComponent) private chatBoxes: QueryList<ChatBoxComponent>;
    chatRooms: any[] = [];

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.listenIoSubjects();
        this.chatService.listenIoEvents();
        this.chatService.emitRequestInitData();
    }

    getDirectRoom(room) {
        const chatUserIndex = _.findIndex(this.chatRooms, function (chatUser) {
            return room._id === chatUser._id;
        });
        // only create new chat box if not existed
        if (chatUserIndex === -1) {
            // allow maximum 3 chat boxes
            if (this.chatRooms.length === 3) {
                this.chatRooms.splice(this.chatRooms.length - 1, 1);
                this.chatRooms.unshift(room);
            } else {
                this.chatRooms.push(room);
            }
        }
    }

    removeChatBox(user) {
        const chatUserIndex = _.findIndex(this.chatRooms, function (chatUser) {
            return user._id === chatUser._id;
        });
        this.chatRooms.splice(chatUserIndex, 1);
    }

    listenIoSubjects() {
        // when connect / disconnect
        this.chatService.socketStatus$.subscribe(socketStatus => {
            this.chatContact.connectionStatus = socketStatus;
        });

        // when initial data comes
        this.chatService.initData$.subscribe(data => {
            this.chatContact.onlineLearners = data.onlineLearners;
        });
    }
}
