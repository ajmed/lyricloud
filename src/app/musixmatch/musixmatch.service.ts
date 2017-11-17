import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Track} from "./track.model";
import {of} from "rxjs/observable/of";
import {LogService} from "../log/log.service";
import {catchError, map, tap} from "rxjs/operators";

(window as any).consumeMusixmatchApiCall = function(data) {
  console.log('inside consume')
}

@Injectable()
export class MusixmatchService {

  apiKey: string = ''
  version: string = '1.1'
  baseUrl: string = 'https://api.musixmatch.com/ws'

  constructor(private http: HttpClient, private log: LogService) {

  }

  queryTrack(query: string, pageSize: number, page: number): Observable<Track[]> {
    const method = 'track.search'
    const baseQueryParams = `format=jsonp&callback=consumeMusixmatchApiCall&apikey=${this.apiKey}`
    const queryParams = `query=${query}&page_size=${pageSize}&page=${page}`
    const url = `${this.baseUrl}/${this.version}/${method}?${baseQueryParams}&${queryParams}`
    console.log(url)
    return this.http.get<any>(url).pipe(
      map(response => (response as any).track_list),
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
