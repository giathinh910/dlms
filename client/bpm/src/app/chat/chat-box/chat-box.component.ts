import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StorageService } from "../../global/services/storage.service";
import { ChatService } from "../services/chat.service";

@Component({
    selector: 'bpm-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnChanges {
    displayState = true;
    @ViewChild('messagesDiv') private messagesDivER: ElementRef;
    @Input() chatRoom: any;
    @Input() private chatRoomIndex: number;
    @Output() onCloseButtonClicked = new EventEmitter<any>();
    cssRight = 0;
    chatForm: FormGroup;
    messages = [];
    // lastMessagesLength = 0;

    constructor(private chatService: ChatService,
                private formBuilder: FormBuilder,
                private storageService: StorageService) {
    }

    ngOnInit() {
        this.observeSocketEvents();

        this.calculatePosition();

        this.chatForm = this.formBuilder.group({
            content: ['', Validators.required],
            room: this.chatRoom.room._id,
            user: this.formBuilder.group({
                _id: this.storageService.getUserId(),
                displayName: this.storageService.getUserDisplayName(),
            }),
            receiver: this.formBuilder.group(this.chatRoom.onlineLearner)
        });

        //
        this.chatService.emitLearnerWantToJoinRoom(this.chatRoom.room._id);

        // fetch messages for this room
        this.messages = this.chatRoom.messages;
        this.scrollMessagesToBottom();
    }

    ngOnChanges() {
        this.calculatePosition();
    }

    calculatePosition() {
        this.cssRight = (this.chatRoomIndex + 1) * 18 + 1; //rem
    }

    onHeaderClick() {
        this.displayState = !this.displayState;
    }

    onCloseButtonClick($event) {
        this.onCloseButtonClicked.emit(this.chatRoomIndex);
        $event.preventDefault();
        $event.stopPropagation();
    }

    isMyMessage(message) {
        return message.isMe || (message.createdBy && message.createdBy._id === this.storageService.getUserId());
    }

    scrollMessagesToBottom() {
        // only auto scroll only if more messages is pushed
        // if (this.lastMessagesLength !== this.messages.length) {
        // let messagesDiv: HTMLElement = this.messagesDivER.nativeElement;
        // messagesDiv.scrollTop = messagesDiv.scrollHeight;
        // this.lastMessagesLength = this.messages.length;
        // }
        const thisComponent = this;
        setTimeout(function () {
            let messagesDiv: HTMLElement = thisComponent.messagesDivER.nativeElement;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 0)
    }

    sendMessage() {
        let message = this.chatForm.value;
        this.chatService.emitLearnerSay(message);
        message.isMe = true;
        this.messages.push(message);
        this.scrollMessagesToBottom();
        this.chatForm.controls['content'].reset();
    }

    observeSocketEvents() {
        // when a message comes
        this.chatService.messagesInRoom$.subscribe(message => {
            if (message.room === this.chatRoom.room._id) {
                this.messages.push(message);
                this.scrollMessagesToBottom();
            }
        });
    }
}
