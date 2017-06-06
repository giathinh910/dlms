import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { CourseModule } from './learner/course/course.module';
import { MasterModule } from './master/master.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        CourseModule,
        MasterModule
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
