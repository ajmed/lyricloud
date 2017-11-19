export class Track {
  constructor(public trackId: number,
              public trackName: string,
              public albumId: number,
              public artistId: number,
              public trackLength: number,
              public hasLyrics: boolean,
              public lyricsBody: string) {

  }
}
