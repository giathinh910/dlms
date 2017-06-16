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
    onlineLearners = [];

    constructor(private chatService: ChatService,
                public storageService: StorageService) {
    }

    ngOnInit() {
        this.observeSocketEvents();
    }

    onHeaderClick() {
        this.displayState = !this.displayState;
    }

    buildOrGetChatBox(onlineLearner) {
        this.onOnlineLearnerClicked.emit(onlineLearner);
    }

    observeSocketEvents() {
        // when connect / disconnect
        this.chatService.socketStatus$.subscribe(socketStatus => {
            this.connectionStatus = socketStatus;
            // reset online learner if lost connection
            if (!socketStatus)
                this.onlineLearners = [];
            else
                this.chatService.emitRequestInitData();
        });

        // when initial data comes
        this.chatService.initData$.subscribe(data => {
            this.onlineLearners = data.onlineLearners;
        });

        // when a learner comes online
        this.chatService.aLearnerComesOnline$.subscribe(learnerWhichComesOnline => {
            this.onlineLearners.unshift(learnerWhichComesOnline);
        });

        // when a learner comes offline
        this.chatService.aLearnerComesOffline$.subscribe(learnerComesOffline => {
            const learnerIndex = _.findIndex(this.onlineLearners, function (onlineLearner) {
                return learnerComesOffline.user._id === onlineLearner.user._id;
            });
            this.onlineLearners.splice(learnerIndex, 1);
        });
    }

    searchOnlineLearner($event) {
        const searchTerm = $event.target.value.toLowerCase();
        if (searchTerm.length === 0) { // reset search
            for (let i in this.onlineLearners) {
                this.onlineLearners[i].searchVisible = true;
            }
        } else {
            for (let i in this.onlineLearners) {
                let displayName = this.onlineLearners[i].user.displayName.toLowerCase();
                this.onlineLearners[i].searchVisible = displayName.indexOf(searchTerm) > -1;
            }
        }
    }

    showOnlineLearner(onlineLearner) {
        const isMe = onlineLearner.user._id === this.storageService.getUserId();
        const searchVisible = typeof onlineLearner.searchVisible === 'undefined' || onlineLearner.searchVisible;

        return !isMe && searchVisible;
    }
}
