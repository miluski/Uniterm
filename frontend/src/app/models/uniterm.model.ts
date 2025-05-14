export enum OperationType {
  PARALLEL = 'PARALLEL',
  SEQUENCE = 'SEQUENCE',
}

export interface Uniterm {
  id?: number;
  name: string;
  expression: string;
  secondExpression?: string;
  separator?: string;
  sequentialSeparator?: string;
  isTransformed?: boolean;
}

export interface UnitermElement {
  id?: number;
  expressionA: string;
  expressionB: string;
}

export interface CompositeOperation {
  id: string;
  firstUnitermId: number;
  secondUnitermId: number;
  operationType: OperationType;
  name?: string;
}

export interface TransformationPreview {
  originalOperation: CompositeOperation;
  replacedUnitermIndex: 0 | 1;
  replacementOperation: CompositeOperation;
}

export interface OperationSelection {
  selectedUniterms: number[];
  operationType: OperationType;
}

export interface UnitermPair {
  id?: number;
  parallelExpressions: string[];
  sequentialExpressions: string[];
  separator: string;
}
