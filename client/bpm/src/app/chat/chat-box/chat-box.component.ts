import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
    selector: 'bpm-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnChanges {
    displayState = true;
    @Input() user: any;
    @Input() private userIndex: number;
    @Output() onCloseButtonClicked = new EventEmitter<any>();
    cssRight: number;

    constructor() {
    }

    ngOnInit() {
        this.calculatePosition();
    }

    ngOnChanges() {
        this.calculatePosition();
    }

    calculatePosition() {
        this.cssRight = (this.userIndex + 1) * 18 + 1; //rem
    }

    onHeaderClick() {
        this.displayState = !this.displayState;
    }

    onCloseButtonClick($event) {
        this.onCloseButtonClicked.emit(this.user);
        $event.preventDefault();
        $event.stopPropagation();
    }
}
