import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'bpm-lesson-list',
    templateUrl: './lesson-list.component.html',
    styleUrls: [ './lesson-list.component.scss' ]
})
export class LessonListComponent implements OnInit {
    @Output() onLessonSelected = new EventEmitter<any>();

    tabs = {
        tab1: { name: 'Contents', active: true },
        tab2: { name: 'Notebook', active: false },
    };
    lessons: any[] = [
        {
            Name: 'Group 1',
            Lessons: [
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                }
            ]
        },
        {
            Name: 'Group 2',
            Lessons: [
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                }
            ]
        },
        {
            Name: 'Group31',
            Lessons: [
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                },
                {
                    Name: 'Lesson1 fdsfdsfds',
                    Duration: 243254,
                    Seen: false
                }
            ]
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    onTabChange(e, key) {
        this.tabs[ 'tab1' ].active = false;
        this.tabs[ 'tab2' ].active = false;
        this.tabs[ key ].active = true;
        e.preventDefault();
    }

    onLessonClick(lesson) {
        this.onLessonSelected.emit(lesson);
    }

    convertTime(second: number): any {
        return (second % 60) + 'm' + (second - (second / 60) * 60) + 's';
    }
}
