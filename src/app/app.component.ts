import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MusixmatchService} from "./musixmatch/musixmatch.service";
import {Observable} from "rxjs/Observable";
import {Track} from "./musixmatch/track.model";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container>
      <div style="text-align:center">

        <h1>Welcome to {{title}}!</h1>
        
        <mat-form-field class="full-width">
          <input [(ngModel)]="query" color="primary" type="text" class="full-width" matInput placeholder="search song | artist | album"/>
        </mat-form-field>
        <br>
        <button mat-raised-button (click)="queryTracks()">search</button>

        <!-- list of track(s) -->
        <p>Search results:</p>
        <ul>
          <li *ngFor="let result of queryResults" (click)="onSelectTrack(result)">
            <track-list-item [track]="result"></track-list-item>
          </li>
        </ul>
        
        <img width="300" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==">
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

  title = 'Lyrical Clouds';
  lyrics = ''
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
  }

  queryTracks() {
    this.lastCallToQueryTracks = new Date().getTime()
    const tracks: Observable<Track[]> = this.musixmatchService.queryTrack(this.query,20, 1)
    tracks.subscribe(tracks => this.queryResults = tracks)
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
