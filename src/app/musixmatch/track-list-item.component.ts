import {Component, Input} from '@angular/core';
import {Track} from "./track.model";

@Component({
  selector: 'track-list-item',
  template: `
    <div>Id: {{track.trackId}}</div>
    <div>Name: {{track.trackName}}</div>
  `,
  styles: [``],

})
export class TrackListItemComponent {

  @Input() track: Track

  constructor() { }

}
