import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders } from '@angular/common/http';
//error handling rxjs
import { catchError, map, tap} from 'rxjs/operators';


const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


@Injectable({
  providedIn: 'root'
})
  
export class HeroService {

  private heroesUrl = 'api/heroes';


  constructor(private http: HttpClient, 
              private messageService: MessageService) { }

  getHeroes() : Observable<Hero[]>{
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('Fetched Heroes')),
      catchError(this.handleError('getHeroes', []))
    );
    //return of(HEROES);
  }

  getHero(id: number) : Observable<Hero>{
    //this.messageService.add(`HeroService : fetched hero id=${id}`);
    //return of(HEROES.find(hero=>hero.id===id));
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fecthed hero id=${id}`)),
      catchError(this.handleError<Hero>(`gerHero id=${id}`))
    );
  } 

  updateHero(hero: Hero): Observable<any>{
    
  
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }
  
  addHero(hero: Hero) : Observable<Hero> {
      return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
        tap((hero: Hero) => this.log(`added Hero w/ id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      )
  }

  deleteHero(hero: Hero | number): Observable<Hero>{
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]>{
    if(!term.trim()){
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string)
  {
    this.messageService.add(`HeroService : ${message}`);
  }

  private handleError<T>(operation='operation', result?: T){
    return (error:any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
