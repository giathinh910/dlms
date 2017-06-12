import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { JwtHelper } from "angular2-jwt";
import { AuthService } from "../services/auth.service";
import { StorageService } from "../../global/services/storage.service";
import { Router } from "@angular/router";

@Component({
    selector: 'bpm-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    registerFormErrors = {
        'email': '',
        'password': '',
        'displayName': '',
        'invalid': ''
    };
    registerFormValidationMessages = {
        'email': {
            'required': 'Vui lòng nhập email',
            'pattern': 'Email phải có định dạng email@example.com'
        },
        'password': {
            'required': 'Vui lòng nhập mật khẩu'
        },
        'displayName': {
            'required': 'Vui lòng nhập tên hiển thị'
        }
    };
    submitted = false;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private storageService: StorageService,
                private router: Router) {
    }

    ngOnInit() {
        if (this.authService.loggedIn()) {
            this.router.navigateByUrl('/');
        }

        // Build form
        this.registerForm = this.formBuilder.group({
            email: ['learner1@email.com', [
                Validators.required,
                Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            ]],
            password: ['121212', [Validators.required]],
            displayName: ['Learner 1', [Validators.required]]
        });

        this.registerForm.valueChanges.subscribe(data => this.onValueChanged(data));

        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.registerForm) {
            return;
        }
        const form = this.registerForm;
        for (const field in this.registerFormErrors) {
            // clear previous error message (if any)
            this.registerFormErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.registerFormValidationMessages[field];
                for (const key in control.errors) {
                    this.registerFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    onSubmit() {
        if (!this.registerForm.valid || this.submitted) {
            return;
        }
        this.submitted = true;
        this.authService.register(this.registerForm.value).then(res => {
            this.submitted = false;
            if (!res.error) {
                this.router.navigateByUrl('/login');
            } else {
                console.log(res.error);
                this.registerFormErrors.invalid = res.error;
            }
        });
    }

}
