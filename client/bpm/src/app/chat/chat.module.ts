import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatContactComponent } from './chat-contact/chat-contact.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatComponent } from './chat.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ChatComponent,
        ChatContactComponent,
        ChatBoxComponent
    ],
    exports: [
        ChatComponent
    ]
})
export class ChatModule {
}
