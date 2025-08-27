import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUser(): Observable<any[]> {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/todos').pipe(map(user => user.slice(0, 10)));
  }
}
