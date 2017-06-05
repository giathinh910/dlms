import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CourseDetailComponent } from '../../learner/course/course-detail/course-detail.component';
import { LessonListComponent } from '../../learner/course/lesson-list/lesson-list.component';
import { LessonDetailComponent } from '../../learner/course/lesson-detail/lesson-detail.component';
import { CourseComponent } from './course.component';


const routes: Routes = [
  {
    path: 'course',
    component: CourseComponent,
    children: [
      {
        path: '',
        component: CourseDetailComponent
      },
      {
        path: 'detail',
        component: CourseDetailComponent
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
  ]
})
export class CourseModule {
}
