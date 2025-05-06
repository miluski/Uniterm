import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Uniterm, OperationType, CompositeOperation, TransformationPreview } from "../models/uniterm.model";

@Injectable({
  providedIn: 'root'
})
export class UnitermService {
  private apiUrl = 'http://localhost:8080/api/uniterms';
  private operations: CompositeOperation[] = [];

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
  
  previewReplaceFirstUniterm(uniterm: Uniterm): Uniterm {
    return this.previewTransformation(uniterm);
  }
  
  previewReplaceSecondUniterm(uniterm: Uniterm): Uniterm {
    return this.previewTransformation(uniterm);
  }

  createTransformedUniterm(uniterm: Uniterm, replaceFirstUniterm: boolean): Observable<Uniterm> {
    const transformed = this.previewTransformation(uniterm);
    return this.saveUniterm(transformed);
  }

  getOperations(): CompositeOperation[] {
    return [...this.operations]; 
  }
  
  createOperation(firstUnitermId: number, secondUnitermId: number, operationType: OperationType): CompositeOperation {
    const operation: CompositeOperation = {
      id: `op-${Date.now()}`, 
      firstUnitermId,
      secondUnitermId,
      operationType,
      name: `Operation ${this.operations.length + 1}`
    };
    
    this.operations.push(operation);
    return operation;
  }
  
  createTransformationPreview(
    operationId: string,
    replacedUnitermIndex: 0 | 1,
    replacementUnitermIds: number[]
  ): TransformationPreview | null {
    const originalOperation = this.operations.find(op => op.id === operationId);
    
    if (!originalOperation || replacementUnitermIds.length < 2) {
      return null;
    }
    
    const replacementOperation: CompositeOperation = {
      id: `replacement-${Date.now()}`,
      firstUnitermId: replacementUnitermIds[0],
      secondUnitermId: replacementUnitermIds[1],
      operationType: OperationType.SEQUENCE
    };
    
    return {
      originalOperation,
      replacedUnitermIndex,
      replacementOperation
    };
  }
  
  applyTransformation(preview: TransformationPreview): void {
    const transformedOperation: CompositeOperation = {
      id: `transformed-${Date.now()}`,
      firstUnitermId: preview.replacedUnitermIndex === 0 
        ? preview.replacementOperation.firstUnitermId 
        : preview.originalOperation.firstUnitermId,
      secondUnitermId: preview.replacedUnitermIndex === 1 
        ? preview.replacementOperation.secondUnitermId 
        : preview.originalOperation.secondUnitermId,
      operationType: OperationType.PARALLEL,
      name: `Transformed ${preview.originalOperation.name || 'operation'}`
    };
    this.operations.push(transformedOperation);
  }
}