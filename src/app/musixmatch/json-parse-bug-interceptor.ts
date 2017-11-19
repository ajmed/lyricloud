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

/**
 * Alright, let's go over this because it's pretty hacky.
 * Currently there's a "bug" in angular where a response from a server is automatically
 * parsed as JSON if the request's content type header is json (go figure).
 * However, if the content type is actually jsonp (the case for most web apis as a loophole to handle the
 * issue of requesting a resource from a different domain).
 * That said, jsonp is not defined as a valid content type,
 * so when we make the request we still need to request json, not jsonp. When the response comes back
 * as jsonp and NOT json, the JSON parser says "WHOA THERE, that's not valid json."
 * Although the json parser is correct here, we're all like "c'mon man, just let it through."
 * Therefore, we need this HttpInterceptor to handle any responses that are
 * valid (http status of 200-300) and are an
 * error in the parser's eyes. If those conditions are met we
 * parse out the jsonp function wrapper and pass the response through like nothing happened.
 */
@Injectable()
export class JsonParseBugInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).catch((err: HttpErrorResponse) => {
        if (err.status >= 200 && err.status < 300) {

          const res = new HttpResponse({
            body: err.error.text,
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
