import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChatService } from "./services/chat.service";
import { ChatContactComponent } from "./chat-contact/chat-contact.component";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { AuthService } from "../auth/services/auth.service";
import * as _ from "lodash";

@Component({
    selector: 'bpm-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [AuthService]
})
export class ChatComponent implements OnInit {
    @ViewChild(ChatContactComponent) private chatContact: ChatContactComponent;
    @ViewChildren(ChatBoxComponent) private chatBoxes: QueryList<ChatBoxComponent>;
    chatRooms: any[] = [
        // {
        //     room: obj,
        //     onlineUser: obj
        // }
    ];

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.chatService.listenIoEvents();

        this.chatService.emitRequestInitData();

        this.observeSocketEvents();
    }

    buildRoom(roomData) {
        const chatUserIndex = _.findIndex(this.chatRooms, function (chatRoom) {
            return roomData.room._id === chatRoom._id;
        });
        // only create new chat box if not existed
        if (chatUserIndex === -1) {
            // allow maximum 3 chat boxes
            if (this.chatRooms.length === 3) {
                this.chatRooms.splice(this.chatRooms.length - 1, 1);
                this.chatRooms.unshift(roomData);
            } else {
                this.chatRooms.push(roomData);
            }
        }
    }

    removeChatBox(user) {
        const chatUserIndex = _.findIndex(this.chatRooms, function (chatUser) {
            return user._id === chatUser._id;
        });
        this.chatRooms.splice(chatUserIndex, 1);
    }

    observeSocketEvents() {
        // when some learner says, decide if chat box should pop up automatically
        this.chatService.someLearnerMessages$.subscribe(message => {
            // find room index
            const roomIndex = _.findIndex(this.chatRooms, function (chatRoom) {
                return message.room === chatRoom.room._id;
            });

            // auto pop chat box up only if chat box hasn't existed && found learner in contact list
            if (roomIndex === -1) {
                // find online user index
                const learnerIndex = _.findIndex(this.chatContact.onlineLearners, function (onlineLearner) {
                    return message.user._id === onlineLearner.user._id;
                });
                this.chatContact.buildChatBox(this.chatContact.onlineLearners[learnerIndex], message);
            }
        })
    }

}
