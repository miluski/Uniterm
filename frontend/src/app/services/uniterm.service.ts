import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { OperationType, Uniterm } from "../models/uniterm.model";

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
        isTransformed: true,
        elements: [...uniterm.elements]
      };
    }
    return uniterm;
  }

  createTransformedUniterm(uniterm: Uniterm): Observable<Uniterm> {
    const transformed = this.previewTransformation(uniterm);
    return this.saveUniterm(transformed);
  }
}