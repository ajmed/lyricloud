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
 * parsed as JSON if the request is json (go figure). However, the content type is actually jsonp
 * for most web apis to avoid a cross domain request. That said, jsonp is not defined as a valid content type,
 * so when we make the request we still need to request json, not jsonp. When the response comes back
 * as jsonp and NOT json, angular says "WHOA THERE, that's not valid json." Although angular is correct here,
 * we're all like "c'mon man, just let it through." Therefore, we need this HttpInterceptor to handle any responses
 * that are valid (http status of 200-300) and are an error in angular's eyes. If those conditions are met we
 * parse out the jsonp function wrapper and pass the response through like nothing happened.
 *
 * NOTE: Ensure any jsonp callback query parameter is named exactly 'callback', otherwise this interceptor will
 * not parse the response correctly. It depends on the length of the callback function string, so technically, any
 * callback with 8 letters will work, but standards work well, so keep it as callback.
 * For example, https://example.com/api/1.1/getresource?format=jsonp&callback=callback, notice the callback parameter
 * is exactly 'callback'.
 */
@Injectable()
export class JsonParseBugInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).catch((err: HttpErrorResponse) => {
        if (err.status >= 200 && err.status < 300) {
          const result: String = JSON.stringify(err.error.text)

          const body: any = JSON.parse(result.substr(10, result.length-13)
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
