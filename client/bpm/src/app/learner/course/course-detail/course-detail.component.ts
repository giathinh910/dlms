import { Component, OnInit, ViewChild } from '@angular/core';
import { LessonDetailComponent } from "../lesson-detail/lesson-detail.component";

@Component({
  selector: 'bpm-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  @ViewChild(LessonDetailComponent)
  private lessonDetailComponent: LessonDetailComponent;

  constructor() { }

  ngOnInit() {
  }

  onLessonSelected(lesson){
    this.lessonDetailComponent.getLesson(lesson);
  }
}
