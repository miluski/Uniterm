import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Uniterm } from '../models/uniterm.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-uniterm-dialog',
  templateUrl: './add-uniterm-dialog.component.html',
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
  protected unitermForm: FormGroup;
  protected isEditMode = false;
  protected separatorOptions = [
    { value: ';', label: 'Srednik (;)' },
    { value: ',', label: 'Przecinek (,)' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUnitermDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { uniterm?: Uniterm }
  ) {
    this.isEditMode = !!data?.uniterm;
    let firstExpression = '';
    if (this.isEditMode && data?.uniterm?.expression) {
      const parts = data.uniterm.expression.split(';');
      firstExpression = parts[0]?.trim() || '';
    }
    this.unitermForm = this.fb.group({
      firstExpression: [firstExpression, [Validators.required]],
    });
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected onSave(): void {
    if (this.unitermForm.valid) {
      const firstExp = this.unitermForm.value.firstExpression;
      let expression = firstExp;
      const uniterm: Uniterm = {
        id: this.data?.uniterm?.id,
        name: expression,
        expression: expression
      };
      this.dialogRef.close(uniterm);
    }
  }
}