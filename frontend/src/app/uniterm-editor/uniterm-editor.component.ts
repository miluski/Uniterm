import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Uniterm, OperationType } from '../models/uniterm.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitermService } from '../services/uniterm.service';
import { MatDialog } from '@angular/material/dialog';
import { AddElementDialogComponent } from '../add-element-dialog/add-element-dialog.component';
import { UnitermVisualizationComponent } from '../uniterm-visualisation/uniterm-visualisation.component';

@Component({
  selector: 'app-uniterm-editor',
  templateUrl: './uniterm-editor.component.html',
  styleUrls: ['./uniterm-editor.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    UnitermVisualizationComponent
  ],
  standalone: true,
})
export class UnitermEditorComponent implements OnChanges {
  @Input() uniterm?: Uniterm;

  fontFamily: string = 'Arial';
  fontSize: number = 14;
  transformedUniterm?: Uniterm;
  showTransformationPreview: boolean = false;

  constructor(
    private unitermService: UnitermService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['uniterm']) {
      this.redrawUniterm();
      this.transformedUniterm = undefined;
      this.showTransformationPreview = false;
    }
  }

  redrawUniterm(): void {
    if (!this.uniterm) return;
    console.log('Drawing uniterm:', this.uniterm);
  }

  onFontChange(font: string): void {
    this.fontFamily = font;
    this.redrawUniterm();
  }

  onFontSizeChange(size: number): void {
    this.fontSize = size;
    this.redrawUniterm();
  }

  getUniterm(): Uniterm {
    return this.uniterm
      ? this.uniterm
      : {
          name: '',
          elements: [],
          operationType: OperationType.PARALLEL,
        };
  }
  
  previewTransformation(): void {
    if (!this.uniterm) return;
    
    if (this.uniterm.operationType === OperationType.PARALLEL) {
      this.transformedUniterm = this.unitermService.previewTransformation(this.uniterm);
      this.showTransformationPreview = true;
    }
  }
  
  addElement(): void {
    const dialogRef = this.dialog.open(AddElementDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.uniterm) {
        this.uniterm.elements.push(result);
        this.redrawUniterm();
      }
    });
  }
}