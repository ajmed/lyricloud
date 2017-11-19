import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MusixmatchService} from "./musixmatch/musixmatch.service";
import {Observable} from "rxjs/Observable";
import {Track} from "./musixmatch/track.model";
import {FormBuilder} from "@angular/forms";
import {LcStrUtils} from "./lyracloud-string-utils";

@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container>
      <h1 style="text-align:center">Welcome to {{title}}!</h1>
      
      <form>
        <div style="text-align:center">
          <mat-form-field class="full-width">
            <input color="primary" type="text" class="form-control full-width" matInput 
                   [(ngModel)]="query" 
                   name="query"
                   placeholder="search song | artist | album"/>
          </mat-form-field>
          <br>
          <button type="submit" mat-raised-button (click)="queryTracks()" style="text-align:center">search</button>
        </div>
      </form>

      <!-- list of track(s) -->
      <div>
        <h4>Search results:</h4>
        <ol>
          <li *ngFor="let result of queryResults" (click)="onSelectTrack(result)">
            <span>id: {{result.trackId}} | track name: {{result.trackName}}</span>
          </li>
        </ol>
      </div>
      
      <div *ngIf="selectedTrack">
        <h4>{{ selectedTrack.trackName }} lyrics:</h4>
        <div style="white-space:pre-wrap" [innerHTML]="selectedTrack.lyricsBody"></div>
      </div>
      
    </mat-sidenav-container>
  `,
  styles: [`
    .full-width {
      min-width: 150px;
      max-width: 500px;
      width: 100%;
    }
  `]
})
export class AppComponent implements OnChanges {

  title = 'Lyracloud';
  query = ''
  queryResults: Track[] = []
  selectedTrack: Track
  lastCallToQueryTracks = new Date().getTime()

  constructor(private musixmatchService: MusixmatchService, private formBuilder: FormBuilder) {
    musixmatchService.apiKey = '2de27e73d4e65b33be5f4f2b24ddbf4a'
    musixmatchService.version = '1.1'
  }

  onSelectTrack(track: Track) {
    this.selectedTrack = track
    this.musixmatchService.findLyricsByTrackId(this.selectedTrack.trackId).subscribe( lyrics => {
      this.selectedTrack.lyricsBody = LcStrUtils.jsonStringToHtml(lyrics)
    })
  }

  queryTracks() {
    this.lastCallToQueryTracks = new Date().getTime()
    const tracks: Observable<Track[]> = this.musixmatchService.queryTracks(this.query, 20, 1)
    tracks.subscribe(tracks => { this.queryResults = tracks } )
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(JSON.stringify(changes))
    if (changes['query'].currentValue != changes['query'].previousValue) {
      const elapsedTime = new Date().getTime() - this.lastCallToQueryTracks
      if (elapsedTime > 250) {// if the time since the last query was greater than 250ms, requery
        this.queryTracks()
      }
    }
  }

}
