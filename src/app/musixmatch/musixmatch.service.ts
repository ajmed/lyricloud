import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Track} from "./track.model";
import {of} from "rxjs/observable/of";
import {LogService} from "../log/log.service";
import {catchError, map, tap} from "rxjs/operators";
import {LyracloudEvent} from "../lyracloud-event";

/**
 * The Musixmatch service wraps the musixmatch REST api.
 * Note: The api must be consumed via jsonp responses. Jsonp responses require a global function to invoke. The
 * specific function in question is called consumeMusixmatchJsonpResponse and found in the index.html.
 */
@Injectable()
export class MusixmatchService {

  private _apiKey: string = ''
    set apiKey(value: string) {
      this._apiKey = value;
      this.baseQueryParams = `format=jsonp&callback=callback&apikey=${this._apiKey}`
    }
    get apikey() { return this._apiKey}

  version: string = '1.1'
  private baseUrl: string = 'https://api.musixmatch.com/ws'
  private baseQueryParams = `format=jsonp&callback=callback&apikey=${this._apiKey}`

  constructor(private http: HttpClient, private log: LogService) {
  }


  /**
   * This is the most general MusixmatchService api call. Using this function over other
   * functions requires the most work for the MusixmatchService user. (i.e. you'll have to
   * provide a properly formatted queryParams string like 'query=queen&page_size=1&page=2')
   * That said, this can serve useful in the lyracloud-event.ts that the MusixmatchService doesn't support
   * the operation you're looking for.
   *
   * @param {string} method
   * @param {string} queryParams
   * @returns {Observable<any>}
   */
  baseApiCall(method: string, queryParams: string): Observable<any> {
    const url = `${this.baseUrl}/${this.version}/${method}?${this.baseQueryParams}&${queryParams}`
    return this.http.get<any>(url).pipe(
      catchError(this.handleError('apiCall', []))
    )
  }

  underscoreToCamelCase = function(underscoreCase: string){
    return underscoreCase.replace(/(_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
  };

  queryTrack(query: string, pageSize: number, page: number): Observable<Track[]> {
    const method = 'track.search'
    const queryParams = `query=${query}&page_size=${pageSize}&page=${page}`
    const url = `${this.baseUrl}/${this.version}/${method}?${this.baseQueryParams}&${queryParams}`
    return this.http.get<any>(url).pipe(
      map(response => {
        const camelCaseTrackList = this.underscoreToCamelCase(JSON.stringify(response.track_list))
        return JSON.parse(camelCaseTrackList)
      }),
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
