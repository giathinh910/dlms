import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { CourseModule } from './learner/course/course.module';
import { MasterModule } from './master/master.module';
import { AuthModule } from './auth/auth.module';
import { StorageService } from "./global/services/storage.service";
import { JwtConfigModule } from "./global/jwt-config.module";
import { ChatModule } from "./chat/chat.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        JwtConfigModule,
        AuthModule,
        CourseModule,
        MasterModule,
        ChatModule
    ],
    providers: [
        StorageService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
