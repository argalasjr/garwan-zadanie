import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Developer } from '../model/developer';


@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private readonly BASE_URL = 'https://api.github.com';



  private httpOptions =  {  headers: new HttpHeaders({
    'Content-Type': 'application/vnd.github.v3+json'})
  };

  public authGithub = false;

  constructor(
    private http: HttpClient,

  ) { 
  }

  setAccessToken(result){
    console.log('accessToken set', result.credential.accessToken)
    this.httpOptions = {  headers: new HttpHeaders({
      'Content-Type': 'application/vnd.github.v3+json',
      'Authorization': `token ${result.credential.accessToken}`
    })}
    this.authGithub = true;
    console.log(this.httpOptions.headers)
  }


  getDevelopers(fromId): Observable<Developer[]> {

    const url = `${this.BASE_URL}/users?since=${fromId}`;
    return this.http.get<Developer[]>(url,this.httpOptions)
      .pipe(
        tap(_ => console.log('fetched developers')),
        catchError(this.handleError<Developer[]>('getDevelopers', []))
      );
  }


  getProfile(): Observable<Developer> {
    console.log(this.httpOptions.headers)
    const url = `${this.BASE_URL}/user`;
    return this.http.get<Developer>(url,this.httpOptions)
      .pipe(
        tap(_ => console.log('fetched user')),
        catchError(this.handleError<Developer>('getProfile', null))
      );
  }


  getDeveloperDetail(id): Observable<Developer> {

    const url = `${this.BASE_URL}/users/${id}`;
    return this.http.get<Developer>(url,this.httpOptions)
      .pipe(
        tap(_ => console.log('fetched developer detail ',id)),
        catchError(this.handleError<Developer>('getDeveloperDetail', null))
      );
  }


  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
