import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface LogHttpResType {
    ok: boolean,
    url: string | null,
    status: number,
    statusText: string,
}

@Injectable({
    providedIn: 'root'
})
export class LogHttpResponseService {

    private readonly logHttpRes = new Subject<LogHttpResType>();
    public readonly logHttpRes$ = this.logHttpRes.asObservable();

    constructor() { }

    public logResponse(log: LogHttpResType) {
        this.logHttpRes.next(log);
    }
}
