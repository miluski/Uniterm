import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Uniterm, OperationType } from '../models/uniterm.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-uniterm-dialog',
  templateUrl: './add-uniterm-dialog.component.html',
  styleUrls: ['./add-uniterm-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class AddUnitermDialogComponent {
  unitermForm: FormGroup;
  operationTypes = OperationType;
  operationTypeOptions = [
    { value: OperationType.PARALLEL, label: 'Parallel' },
    { value: OperationType.SEQUENCE, label: 'Sequence' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUnitermDialogComponent>
  ) { 
    this.unitermForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      operationType: [OperationType.PARALLEL, [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.unitermForm.valid) {
      const uniterm: Uniterm = {
        name: this.unitermForm.value.name,
        description: this.unitermForm.value.description,
        operationType: this.unitermForm.value.operationType,
        elements: []
      };
      this.dialogRef.close(uniterm);
    }
  }
}