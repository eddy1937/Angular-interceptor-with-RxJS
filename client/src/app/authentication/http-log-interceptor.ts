import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, PartialObserver, tap } from "rxjs";
import { LogHttpResponseService } from "../log-http-response.service";

@Injectable()
export class HttpLogInterceptor implements HttpInterceptor {

    constructor(private logService: LogHttpResponseService) { }

    private logHttpResponse = (res: any) => res instanceof HttpResponseBase && this.logService.logResponse({...res});

    observer: PartialObserver<any> = {
        next: this.logHttpResponse,
        error: this.logHttpResponse,
    };

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(this.observer));
    }
}
