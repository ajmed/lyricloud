import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Lyrics} from "./lyrics.model";
import {HttpClient} from "@angular/common/http";
import {Track} from "./track.model";
import {catchError, map, tap} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import {LogService} from "../log/log.service";

@Injectable()
export class MusixmatchService {

  apiKey: string = ''
  version: string = '1.1'
  baseUrl: string = 'https://api.musixmatch.com/ws'

  constructor(private http: HttpClient, private log: LogService) {

  }

  queryTrack(query: string, pageSize: number, page: number): Observable<Track[]> {
    const url = `${this.baseUrl}/${this.version}/track.search?apikey=${this.apiKey}&page_size=${pageSize}&page=${page}`
    console.log(url)
    return this.http.get<any>(url).pipe(
      map(response => response.track_list),
      tap(it => console.log(it)),
      catchError(this.handleError('queryTrack', []))
    )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: better job of transforming error for user consumption
      this.log.w(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
