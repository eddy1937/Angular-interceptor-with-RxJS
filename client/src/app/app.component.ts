import { concatMap, delayWhen, mergeMap, of, range, take, tap } from 'rxjs';
import { debounceTime, defer, delay, interval } from 'rxjs';
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

    queryUserInfoByAuth$ = this.authService.queryUserInfoByAuth();

    onLogin$ = defer(() => this.authService.userLogin(this.loginData)).pipe(switchMap(() => this.queryUserInfoByAuth$));

    get logElement() {
        return this.logRef.nativeElement;
    }

    get loginData() {
        return this.loginForm.value;
    }

    constructor(private fb: FormBuilder, public authService: AuthService, private logService: LogHttpResponseService) {
        this.loginForm = this.fb.group({
            account: ['eddylin', Validators.required],
            password: ['password', Validators.required],
        });

        logService.logHttpRes$.pipe(concatMap((x) => of(x).pipe(delay(30)))).subscribe((r) => {
            this.responseLogs.push(r);
            setTimeout(() => this.logElement.scrollTop = this.logElement.scrollHeight,0);
        });
    }

    ngOnInit(): void {
        this.queryUserInfoByAuth();
    }

    onLogin() {
        this.onLogin$.subscribe();
    }

    queryUserInfoByAuth() {
        this.queryUserInfoByAuth$.subscribe();
    }

    queryUserInfoByAuthx10() {
        // interval(10).pipe(take(10), mergeMap(() => this.queryUserInfoByAuth$)).subscribe();
        range(10).pipe(mergeMap(() => this.queryUserInfoByAuth$)).subscribe();
    }
}
