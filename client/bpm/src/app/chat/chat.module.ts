import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from "./services/chat.service";
import { ChatComponent } from './chat.component';
import { ChatContactComponent } from './chat-contact/chat-contact.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ChatComponent,
        ChatContactComponent,
        ChatBoxComponent
    ],
    exports: [
        ChatComponent
    ],
    providers: [
        ChatService
    ]
})
export class ChatModule {
}
