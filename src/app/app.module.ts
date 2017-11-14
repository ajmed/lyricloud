import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MusixmatchService } from './musixmatch/musixmatch.service';
import { LogService } from './log/log.service';
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [MusixmatchService, LogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
