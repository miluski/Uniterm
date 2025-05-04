export enum OperationType {
  SEQUENCE = 'SEQUENCE',
  PARALLEL = 'PARALLEL',
  UNION = 'UNION',
}

export interface Uniterm {
  id?: number;
  name: string;
  description?: string;
  elements: UnitermElement[];
  operationType: OperationType;
  isTransformed?: boolean;
}

export interface UnitermElement {
  id?: number;
  expressionA: string;
  expressionB: string;
  expressionC?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}