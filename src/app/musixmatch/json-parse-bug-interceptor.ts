
import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/observable'
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";

@Injectable()
export class JsonParseBugInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .catch((err: HttpErrorResponse) => {
        if (err.status >= 200 && err.status < 300) {
          const result: String = JSON.stringify(err.error.text)
          const body: any = JSON.parse(result.substr(26, result.length-29)
            .replace(new RegExp('\\\\', 'g'), '')).message.body

          const res = new HttpResponse({
            body: body,
            headers: err.headers,
            status: err.status,
            statusText: err.statusText,
            url: err.url
          });

          return Observable.of(res);
        } else {
          return Observable.throw(err);
        }
      });
  }
}
