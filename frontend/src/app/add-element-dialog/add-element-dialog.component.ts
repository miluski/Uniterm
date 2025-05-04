import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UnitermElement } from '../models/uniterm.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-element-dialog',
  templateUrl: './add-element-dialog.component.html',
  styleUrls: ['./add-element-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class AddElementDialogComponent {
  elementForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { element?: UnitermElement }
  ) {
    this.isEditMode = !!data?.element;
    
    this.elementForm = this.fb.group({
      expressionA: [data?.element?.expressionA || '', [Validators.required]],
      expressionB: [data?.element?.expressionB || '', [Validators.required]],
      expressionC: [data?.element?.expressionC || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.elementForm.valid) {
      const element: UnitermElement = {
        id: this.data?.element?.id,
        expressionA: this.elementForm.value.expressionA,
        expressionB: this.elementForm.value.expressionB,
        expressionC: this.elementForm.value.expressionC
      };
      this.dialogRef.close(element);
    }
  }
}