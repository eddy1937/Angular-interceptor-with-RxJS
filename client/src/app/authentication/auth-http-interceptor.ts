import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, defer, EMPTY, finalize, iif, Observable, takeUntil, throwError } from "rxjs";
import { doBeforeSubscribe, filterIsFalsy, InterceptorSkipHeader, startWhen } from "../uitls";
import { AuthService } from "./auth.service";

function catchHttpError(...status: Array<number>) {
  const statusMap = status.reduce((m, v) => m.set(v, v), new Map());
  return (next: (err: HttpErrorResponse) => Observable<any>) => {
    return catchError((err) => err instanceof HttpErrorResponse && statusMap.has(err.status) ? next(err) : throwError(err));
  };
}

const catch401Error = catchHttpError(401);
const catch400Error = catchHttpError(400);
const catch403Error = catchHttpError(403);
const catch406Error = catchHttpError(406);
const catch500Error = catchHttpError(500);

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  logoutUser$ = defer(() => (this.authService.logout(), EMPTY));

  refreshToken$ = this.authService.refreshTokenFromServer().pipe(
    doBeforeSubscribe(() => this.isRefreshing$.next(true)),
    catchError(() => this.logoutUser$),
    finalize(() => this.isRefreshing$.next(false))
  );

  isRefreshing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  refreshIsDone$ = this.isRefreshing$.pipe(filterIsFalsy());

  refresh$ = iif(() => this.isRefreshing$.value, this.refreshIsDone$, this.refreshToken$);

  constructor(private authService: AuthService) { }

  private applyCredentials(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: 'Bearer ' + this.authService.accessToken }
    });
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (InterceptorSkipHeader.has(request)) {
      const req = InterceptorSkipHeader.deleteHeader(request);
      return next.handle(req);
    }
    const nextHandle$ = defer(() => next.handle(this.applyCredentials(request)));
    return iif(() => this.authService.tokenIsEmpty, this.logoutUser$, nextHandle$).pipe(this.httpErrorsHandler());
  }

  httpErrorsHandler() {
    return (source$: Observable<any>) => source$.pipe(
      catch401Error(() => this.handle401Error(source$)),
      catch400Error((err) => EMPTY),
      catch403Error((err) => EMPTY),
      catch406Error((err) => EMPTY),
      catch500Error((err) => EMPTY),
    );
  }

  handle401Error(retry$: Observable<any>): Observable<any> {
    return retry$.pipe(
      startWhen(this.refresh$),
      takeUntil(this.authService.logout$),
      catch401Error(() => this.logoutUser$),
    );
  }
}
