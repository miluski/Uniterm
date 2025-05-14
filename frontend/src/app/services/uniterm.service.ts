import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Uniterm } from '../models/uniterm.model';

@Injectable({
  providedIn: 'root',
})
export class UnitermService {
  private apiUrl = 'http://localhost:8080/api/uniterms';

  constructor(private http: HttpClient) {}

  getUniterms(): Observable<Uniterm[]> {
    console.log('Fetching uniterms from:', this.apiUrl);
    return this.http.get<Uniterm[]>(this.apiUrl).pipe(
      tap((data) => console.log('Fetched uniterms:', data)),
      catchError((error) => {
        console.error('Error fetching uniterms:', error);
        throw error;
      })
    );
  }

  getUnitermById(id: number): Observable<Uniterm> {
    return this.http.get<Uniterm>(`${this.apiUrl}/${id}`).pipe(
      tap((data) => console.log(`Fetched uniterm id=${id}:`, data)),
      catchError((error) => {
        console.error(`Error fetching uniterm id=${id}:`, error);
        throw error;
      })
    );
  }

  saveUniterm(uniterm: Uniterm): Observable<Uniterm> {
    console.log('Saving uniterm:', uniterm);
    if (uniterm.id) {
      return this.http
        .put<Uniterm>(`${this.apiUrl}/${uniterm.id}`, uniterm)
        .pipe(
          tap((data) => console.log('Updated uniterm:', data)),
          catchError((error) => {
            console.error('Error updating uniterm:', error);
            throw error;
          })
        );
    } else {
      return this.http.post<Uniterm>(this.apiUrl, uniterm).pipe(
        tap((data) => console.log('Created uniterm:', data)),
        catchError((error) => {
          console.error('Error creating uniterm:', error);
          throw error;
        })
      );
    }
  }

  deleteUnitermById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
