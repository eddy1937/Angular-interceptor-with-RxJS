import { HttpRequest } from "@angular/common/http";
import { concat, defer, filter, ignoreElements, Observable, take } from "rxjs";

class Xheader {
  static readonly interceptorSkipHeader = new Xheader('interceptorSkipHeader');

  readonly headers = { [this.headerName]: this.headerName };
  readonly options = { headers: this.headers };

  private constructor(readonly headerName: string) { }

  public checkHeader({ headers }: HttpRequest<any>) {
    return headers.has(this.headerName);
  }

  public deleteHeader(request: HttpRequest<any>) {
    return request.clone({ headers: request.headers.delete(this.headerName) });
  }
}

export const InterceptorSkipHeader = Xheader.interceptorSkipHeader;


export function filterIsTruthy<T>() {
  return filter<T>((x) => !!x);
}

export function filterIsFalsy<T>() {
  return filter<T>((x) => !x);
}

export function doBeforeSubscribe(callback: () => void) {
  return (source$: Observable<any>) => defer(() => {
    callback();
    return source$;
  });
}

export function startWhen<T>(subscriptionDelay: Observable<any>) {
  return (source$: Observable<T>) => concat(subscriptionDelay.pipe(take(1), ignoreElements()), source$);
}
