import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MusixmatchService } from './musixmatch/musixmatch.service';
import { LogService } from './log/log.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JsonParseBugInterceptor} from "./musixmatch/json-parse-bug-interceptor";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JsonParseBugInterceptor,
      multi: true
    },
    MusixmatchService,
    LogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
