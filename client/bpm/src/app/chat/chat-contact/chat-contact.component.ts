import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from "../services/chat.service";
import { StorageService } from "../../global/services/storage.service";
import * as _ from "lodash";

@Component({
    selector: 'bpm-chat-contact',
    templateUrl: './chat-contact.component.html',
    styleUrls: ['./chat-contact.component.scss']
})
export class ChatContactComponent implements OnInit {
    connectionStatus = false;
    displayState = false;
    @Output() onOnlineLearnerClicked = new EventEmitter<any>();
    onlineLearners: any[] = [];

    constructor(private chatService: ChatService,
                public storageService: StorageService) {
    }

    ngOnInit() {
        this.observeSocketEvents();
    }

    onHeaderClick() {
        this.displayState = !this.displayState;
    }

    buildChatBox(onlineLearner, extraMessage?) {
        this.chatService.createOrGetRoom(onlineLearner.user._id).then(room => {
            let newChatRoomData = {
                room: room,
                onlineLearner: onlineLearner.user
            };
            newChatRoomData['extraMessage'] = extraMessage ? extraMessage : null;
            this.onOnlineLearnerClicked.emit(newChatRoomData);
        });
    }

    observeSocketEvents() {
        // when connect / disconnect
        this.chatService.socketStatus$.subscribe(socketStatus => {
            this.connectionStatus = socketStatus;
        });

        // when initial data comes
        this.chatService.initData$.subscribe(data => {
            this.onlineLearners = data.onlineLearners;
        });

        // when learner comes online
        this.chatService.aLearnerComesOnline$.subscribe(learnerWhichComesOnline => {
            this.onlineLearners.unshift(learnerWhichComesOnline);

        });

        // when learner comes offline
        this.chatService.aLearnerComesOffline$.subscribe(learnerComesOffline => {
            const learnerIndex = _.findIndex(this.onlineLearners, function (onlineLearner) {
                return learnerComesOffline._id === onlineLearner.user._id;
            });
            this.onlineLearners.splice(learnerIndex, 1);
        });
    }
}
