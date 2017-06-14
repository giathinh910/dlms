import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StorageService } from "../../global/services/storage.service";

@Component({
    selector: 'bpm-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnChanges {
    displayState = true;
    @ViewChild('messagesDiv') private messagesDivER: ElementRef;
    @Input() room: any;
    @Input() private roomIndex: number;
    @Output() onCloseButtonClicked = new EventEmitter<any>();
    cssRight: number;
    chatForm: FormGroup;
    messages = [];

    constructor(private formBuilder: FormBuilder,
                private storageService: StorageService) {
    }

    ngOnInit() {
        this.calculatePosition();

        this.chatForm = this.formBuilder.group({
            content: ['', Validators.required],
            room: this.room._id,
            user: this.storageService.getUserId(),
            isMe: true
        });

        let thisComponent = this;
        setTimeout(function () {
            thisComponent.messages = [
                {content: 'Hello, I\'m doe'},
                {content: 'Hello cai loz', isMe: true},
                {content: 'Hello, I\'m doe'},
                {content: 'Hello cai loz', isMe: true},
                {content: 'Hello, I\'m doe'},
                {content: 'Hello cai loz', isMe: true},
                {content: 'Hello, I\'m doe'},
                {content: 'Hello cai loz', isMe: true},
                {content: 'Hello, I\'m doe'},
                {content: 'Hello cai loz', isMe: true},
                {content: 'Hello, I\'m doe'},
                {content: 'Hello cai loz', isMe: true},
            ];
        }, 0);
    }

    ngOnChanges() {
        this.calculatePosition();
    }

    calculatePosition() {
        this.cssRight = (this.roomIndex + 1) * 18 + 1; //rem
    }

    onHeaderClick() {
        this.displayState = !this.displayState;
    }

    onCloseButtonClick($event) {
        this.onCloseButtonClicked.emit(this.room);
        $event.preventDefault();
        $event.stopPropagation();
    }

    scrollMessagesToBottom() {
        let messagesDiv: HTMLElement = this.messagesDivER.nativeElement;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    sendMessage() {
        this.messages.push(this.chatForm.value);
        this.scrollMessagesToBottom();
        this.chatForm.controls['content'].reset();
    }
}
