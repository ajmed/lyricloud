import {AfterViewInit, Component, Inject} from '@angular/core';
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import {MusixmatchService} from "./musixmatch/musixmatch.service";
import {Observable} from "rxjs/Observable";
import {Track} from "./musixmatch/track.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {LcStrUtils} from "./lyracloud-string-utils";
import {D3cloudService} from "./d3cloud.service";

@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container>
      <h1 style="text-align:center">Welcome to {{title}}!</h1>
      
      <form [formGroup]="searchForm" (ngSubmit)="queryTracks()">
        <div style="text-align:center">
          <mat-form-field class="full-width">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput type="text" class="full-width" formControlName="query" placeholder="search song | artist | album"/>
          </mat-form-field>
          <br>
          <button type="submit" mat-raised-button style="text-align:center">search</button>
        </div>
      </form>

      <!-- list of track(s) -->
      <div>
        <h4>Search results:</h4>
        <ol>
          <li *ngFor="let result of queryResults" (click)="onSelectTrack(result)">
            <span>id: {{result.trackId}} | track name: {{result.trackName}} | artist: {{result.artistName}}</span>
          </li>
        </ol>
      </div>
      
      <div *ngIf="selectedTrack">
        <h4>{{ selectedTrack.trackName }} lyrics:</h4>
        <div style="white-space:pre-wrap" [innerHTML]="selectedTrack.lyricsBody"></div>
      </div>
      
      <canvas id="wordCloudCanvas"></canvas>
      
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
export class AppComponent implements AfterViewInit {

  title = 'Lyracloud';
  searchForm: FormGroup
  lastQuery = ''
  query = new FormControl("")

  queryResults: Track[] = []
  selectedTrack: Track
  lastApiCall = new Date().getTime()

  canvas

  constructor(private musixmatchService: MusixmatchService,
              private d3CloudService: D3cloudService,
              @Inject(FormBuilder) private formBuilder: FormBuilder) {
    musixmatchService.apiKey = '2de27e73d4e65b33be5f4f2b24ddbf4a'
    musixmatchService.version = '1.1'

    this.searchForm = this.formBuilder.group({ "query": this.query })

    // detect value changes on the query
    this.searchForm.valueChanges
      .filter(value => {
        if (this.lastQuery != value.query) {
          this.lastQuery = value.query
          const elapsedTime = new Date().getTime() - this.lastApiCall
          if (elapsedTime > 750) {
            setTimeout(() => { if (new Date().getTime() - this.lastApiCall > 750) this.queryTracks() }, 1000)
            return true
          }
        }
      }).subscribe(value => {
        this.queryTracks()
      })
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('wordCloudCanvas')
    this.d3CloudService.start(this.canvas)
  }

  onSelectTrack(track: Track) {
    this.selectedTrack = track
    this.musixmatchService.findLyricsByTrackId(this.selectedTrack.trackId).subscribe( lyrics => {
      this.selectedTrack.lyricsBody = LcStrUtils.jsonStringToHtml(lyrics)
    })
  }

  queryTracks() {
    this.lastApiCall = new Date().getTime()
    const tracks: Observable<Track[]> = this.musixmatchService.queryTracks(this.query.value, 20, 1)
    tracks.subscribe(tracks => { this.queryResults = tracks } )
  }

}
