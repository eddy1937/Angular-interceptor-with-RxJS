import { debounceTime, defer } from 'rxjs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { AuthService } from './authentication/auth.service';
import { LogHttpResponseService, LogHttpResType } from './log-http-response.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild("log", { static: true })
    private logRef!: ElementRef<HTMLElement>;

    loginForm: FormGroup;

    responseLogs: Array<LogHttpResType> = [];

    onLogin$ = defer(() => this.authService.userLogin(this.loginData)).pipe(switchMap(() => this.authService.queryUserInfoByAuth()));

    get logElement() {
        return this.logRef.nativeElement;
    }

    get loginData() {
        return this.loginForm.value;
    }

    get isLogin() {
        return this.authService.isLogin;
    }

    constructor(private fb: FormBuilder, private authService: AuthService, private logService: LogHttpResponseService) {
        this.loginForm = this.fb.group({
            account: ['eddylin', Validators.required],
            password: ['password', Validators.required],
        });

        logService.logHttpRes$.subscribe((r) => this.responseLogs.push(r));
        logService.logHttpRes$.pipe(debounceTime(30)).subscribe(() => this.logElement.scrollTo({top: this.logElement.scrollHeight, behavior: 'auto' }));
    }

    ngOnInit(): void {
        this.authService.queryUserInfoByAuth().subscribe();
    }

    onLogin() {
        this.onLogin$.subscribe();
    }

    onLogout() {
        this.authService.logout();
    }
}
