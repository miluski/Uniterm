import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UnitermService } from '../services/uniterm.service';
import { Uniterm, OperationType } from '../models/uniterm.model';
import { AddUnitermDialogComponent } from '../add-uniterm-dialog/add-uniterm-dialog.component';
import { UnitermVisualizationComponent } from '../uniterm-visualisation/uniterm-visualisation.component';
import { UnitermMergeVisualizationComponent } from '../uniterm-merge-visualization/uniterm-merge-visualization.component';

@Component({
  selector: 'app-uniterm-visualization-controller',
  templateUrl: './uniterm-visualisation-controller.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    UnitermVisualizationComponent,
    UnitermMergeVisualizationComponent,
  ],
})
export class UnitermVisualizationControllerComponent implements OnInit {
  protected allUniterms: Uniterm[] = [];
  protected parallelSelection: number[] = [];
  protected sequentialSelection: number[] = [];
  protected parallelUniterms: Uniterm[] = [];
  protected sequentialUniterms: Uniterm[] = [];
  protected showMergeView = false;
  protected separatorOptions = [
    { value: ';', label: 'Semicolon (;)' },
    { value: ',', label: 'Comma (,)' },
  ];
  protected selectedSeparator: string = ';';

  constructor(
    private unitermService: UnitermService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.loadUniterms();
  }

  public loadUniterms(): void {
    this.unitermService.getUniterms().subscribe({
      next: (uniterms) => {
        this.allUniterms = uniterms;
      },
      error: (err) => console.error('Error loading uniterms', err),
    });
  }

  public openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUnitermDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unitermService.saveUniterm(result).subscribe({
          next: () => this.loadUniterms(),
          error: (err) => console.error('Error saving uniterm', err),
        });
      }
    });
  }

  public updateParallelSelection(): void {
    if (this.parallelSelection.length > 2) {
      this.parallelSelection = this.parallelSelection.slice(0, 2);
    }
    this.parallelUniterms = this.parallelSelection
      .map((id) => this.allUniterms.find((uniterm) => uniterm.id === id))
      .filter(Boolean) as Uniterm[];
  }

  public updateSequentialSelection(): void {
    if (this.sequentialSelection.length > 2) {
      this.sequentialSelection = this.sequentialSelection.slice(0, 2);
    }
    this.sequentialUniterms = this.sequentialSelection
      .map((id) => this.allUniterms.find((uniterm) => uniterm.id === id))
      .filter(Boolean) as Uniterm[];
  }

  public toggleMergeView(): void {
    this.showMergeView = !this.showMergeView;
  }

  public handleMergeSelection(event: { index: number; result: string }): void {
    console.log('Merge selected:', event);
  }
}
