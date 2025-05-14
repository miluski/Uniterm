import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
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
    MatSelectModule,
  ],
})
export class AddUnitermDialogComponent {
  protected unitermForm: FormGroup;
  protected isEditMode = false;
  protected separatorOptions = [
    { value: ';', label: 'Średnik (;)' },
    { value: ',', label: 'Przecinek (,)' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUnitermDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { uniterm?: Uniterm }
  ) {
    this.isEditMode = !!data?.uniterm;
    let parallelPart1 = '',
      parallelPart2 = '';
    let sequentialPart1 = '',
      sequentialPart2 = '';
    if (data?.uniterm?.expression) {
      const separator = data.uniterm.separator || ';';
      const parts = data.uniterm.expression.split(
        new RegExp(`\\s*${this.escapeRegExp(separator)}\\s*`)
      );
      parallelPart1 = parts[0]?.trim() || '';
      parallelPart2 = parts[1]?.trim() || '';
    }
    if (data?.uniterm?.secondExpression) {
      const separator =
        data.uniterm.sequentialSeparator || data.uniterm.separator || ';';
      const parts = data.uniterm.secondExpression.split(
        new RegExp(`\\s*${this.escapeRegExp(separator)}\\s*`)
      );
      sequentialPart1 = parts[0]?.trim() || '';
      sequentialPart2 = parts[1]?.trim() || '';
    }
    this.unitermForm = this.fb.group({
      name: [data?.uniterm?.name || ''],
      parallelPart1: [parallelPart1, [Validators.required]],
      parallelPart2: [parallelPart2, [Validators.required]],
      parallelSeparator: [
        data?.uniterm?.separator || ';',
        [Validators.required],
      ],
      sequentialPart1: [sequentialPart1, [Validators.required]],
      sequentialPart2: [sequentialPart2, [Validators.required]],
      sequentialSeparator: [
        data?.uniterm?.sequentialSeparator || data?.uniterm?.separator || ';',
        [Validators.required],
      ],
    });
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  protected onSave(): void {
    if (this.unitermForm.valid) {
      const formValue = this.unitermForm.value;
      const parallelExpression = `${formValue.parallelPart1.trim()} ${
        formValue.parallelSeparator
      } ${formValue.parallelPart2.trim()}`;
      const sequentialExpression = `${formValue.sequentialPart1.trim()} ${
        formValue.sequentialSeparator
      } ${formValue.sequentialPart2.trim()}`;
      const name =
        formValue.name ||
        `${formValue.parallelPart1} + ${formValue.sequentialPart1}`;
      const uniterm: Uniterm = {
        id: this.data?.uniterm?.id,
        name: name,
        expression: parallelExpression,
        secondExpression: sequentialExpression,
        separator: formValue.parallelSeparator,
        sequentialSeparator: formValue.sequentialSeparator,
      };
      console.log('Submitting uniterm:', uniterm);
      this.dialogRef.close(uniterm);
    }
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
