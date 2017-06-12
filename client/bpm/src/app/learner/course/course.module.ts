import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CourseDetailComponent } from '../../learner/course/course-detail/course-detail.component';
import { LessonListComponent } from '../../learner/course/lesson-list/lesson-list.component';
import { LessonDetailComponent } from '../../learner/course/lesson-detail/lesson-detail.component';
import { CourseComponent } from './course.component';
import { AuthGuardService } from "../../auth/services/auth-guard.service";


const routes: Routes = [
    {
        path: 'course',
        component: CourseComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                component: CourseDetailComponent,
                canActivate: [AuthGuardService]
            },
            {
                path: 'detail',
                component: CourseDetailComponent,
                canActivate: [AuthGuardService]
            },
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        CourseDetailComponent,
        LessonListComponent,
        LessonDetailComponent,
        CourseComponent
    ],
    providers: [
        AuthGuardService
    ]
})
export class CourseModule {
}
