import { Observable, of } from "rxjs";
import { OperationType, Uniterm } from "../models/uniterm.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UnitermService {
  private apiUrl = 'http://localhost:8080/api/uniterms';

  constructor(private http: HttpClient) { }

  getUniterms(): Observable<Uniterm[]> {
    return this.http.get<Uniterm[]>(this.apiUrl);
  }

  getUnitermById(id: number): Observable<Uniterm> {
    return this.http.get<Uniterm>(`${this.apiUrl}/${id}`);
  }

  saveUniterm(uniterm: Uniterm): Observable<Uniterm> {
    if (uniterm.id) {
      return this.http.put<Uniterm>(`${this.apiUrl}/${uniterm.id}`, uniterm);
    } else {
      return this.http.post<Uniterm>(this.apiUrl, uniterm);
    }
  }

  deleteUniterm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  previewTransformation(uniterm: Uniterm): Uniterm {
    if (uniterm.operationType === OperationType.PARALLEL) {
      return {
        ...uniterm,
        operationType: OperationType.SEQUENCE,
        isTransformed: true
      };
    }
    return uniterm;
  }
}