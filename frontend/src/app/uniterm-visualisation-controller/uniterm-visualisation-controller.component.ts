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
import { UnitermVisualisationComponent } from '../uniterm-visualisation/uniterm-visualisation.component';
import { UnitermMergeVisualizationComponent } from '../uniterm-merge-visualization/uniterm-merge-visualization.component';
import { HttpClient } from '@angular/common/http';

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
    UnitermVisualisationComponent,
    UnitermMergeVisualizationComponent,
  ],
  styles: [
    `
      .visualization-controller {
        padding: 20px;
      }

      .uniterm-controls {
        margin-bottom: 20px;
      }

      .uniterm-list {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .select-uniterm {
        min-width: 300px;
      }

      .visualizations {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .parallel-visualization,
      .sequential-visualization {
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 16px;
        background-color: #f9f9f9;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 16px;
      }

      h3 {
        color: #3498db;
        margin-bottom: 12px;
      }
    `,
  ],
})
export class UnitermVisualisationControllerComponent implements OnInit {
  protected allUniterms: Uniterm[] = [];
  protected selectedUnitermId?: number;
  protected selectedUniterm?: Uniterm;
  protected parallelUniterms: Uniterm[] = [];
  protected sequentialUniterms: Uniterm[] = [];

  constructor(
    private unitermService: UnitermService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.loadUniterms();
  }

  public loadUniterms(): void {
    this.unitermService.getUniterms().subscribe({
      next: (uniterms) => {
        console.log('Service response:', uniterms);
        this.processUniterms(uniterms);
      },
      error: (err) => {
        console.error('Error loading uniterms:', err);
        this.loadViaDirectHttp();
      },
    });
  }

  private loadViaDirectHttp(): void {
    const url = 'http://localhost:8080/api/uniterms';
    console.log('Trying direct HTTP call to:', url);
    this.http.get<Uniterm[]>(url).subscribe({
      next: (data) => {
        console.log('Direct HTTP response:', data);
        this.processUniterms(data);
      },
      error: (err) => console.error('Direct HTTP error:', err),
    });
  }

  private processUniterms(uniterms: Uniterm[]): void {
    if (!uniterms || uniterms.length === 0) {
      console.warn('No uniterms received from backend');
      return;
    }
    this.allUniterms = uniterms;
    if (this.allUniterms.length > 0 && !this.selectedUnitermId) {
      this.selectUniterm(this.allUniterms[0].id!);
    } else if (this.selectedUnitermId) {
      this.selectUniterm(this.selectedUnitermId);
    }
  }
  
  public selectUniterm(id: number): void {
    this.selectedUnitermId = id;
    this.selectedUniterm = this.allUniterms.find((u) => u.id === id);
    if (this.selectedUniterm) {
      console.log('Selected uniterm:', this.selectedUniterm);
      const parallelExpression = this.selectedUniterm.expression || '';
      const parallelSeparator = this.selectedUniterm.separator || ';';
      const parallelParts = parallelExpression
        .split(new RegExp(`\\s*${this.escapeRegExp(parallelSeparator)}\\s*`))
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
      this.parallelUniterms = [
        {
          id: 1,
          name: parallelParts[0] || '',
          expression: parallelParts[0] || '',
          separator: parallelSeparator,
        },
        {
          id: 2,
          name: parallelParts.length > 1 ? parallelParts[1] : '',
          expression: parallelParts.length > 1 ? parallelParts[1] : '',
          separator: parallelSeparator,
        },
      ];
      const sequentialExpression = this.selectedUniterm.secondExpression || '';
      const sequentialSeparator =
        this.selectedUniterm.sequentialSeparator ||
        this.selectedUniterm.separator ||
        ';';
      const sequentialParts = sequentialExpression
        .split(new RegExp(`\\s*${this.escapeRegExp(sequentialSeparator)}\\s*`))
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
      this.sequentialUniterms = [
        {
          id: 3,
          name: sequentialParts[0] || '',
          expression: sequentialParts[0] || '',
          separator: parallelSeparator,
          sequentialSeparator: sequentialSeparator,
        },
        {
          id: 4,
          name: sequentialParts.length > 1 ? sequentialParts[1] : '',
          expression: sequentialParts.length > 1 ? sequentialParts[1] : '',
          separator: parallelSeparator,
          sequentialSeparator: sequentialSeparator,
        },
      ];
      console.log('Parallel uniterms with separators:', this.parallelUniterms);
      console.log(
        'Sequential uniterms with separators:',
        this.sequentialUniterms
      );
    }
  }

  public openAddDialog(): void {
    console.log('Opening add dialog');
    const dialogRef = this.dialog.open(AddUnitermDialogComponent, {
      width: '500px',
      data: {
        uniterm: null,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      if (result) {
        console.log('Saving new uniterm:', result);
        this.unitermService.saveUniterm(result).subscribe({
          next: (savedUniterm) => {
            console.log('Uniterm saved successfully:', savedUniterm);
            this.loadUniterms();
            setTimeout(() => {
              if (savedUniterm.id) {
                this.selectUniterm(savedUniterm.id);
              }
            }, 300);
          },
          error: (err) => {
            console.error('Error saving uniterm:', err);
            this.saveViaDirectHttp(result);
          },
        });
      }
    });
  }

  public openEditDialog(): void {
    if (!this.selectedUniterm) {
      console.warn('No uniterm selected for editing');
      return;
    }
    const dialogRef = this.dialog.open(AddUnitermDialogComponent, {
      width: '500px',
      data: {
        uniterm: this.selectedUniterm,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Updating uniterm:', result);
        this.unitermService.saveUniterm(result).subscribe({
          next: (savedUniterm) => {
            console.log('Uniterm updated successfully:', savedUniterm);
            this.loadUniterms();
          },
          error: (err) => console.error('Error updating uniterm:', err),
        });
      }
    });
  }

  private saveViaDirectHttp(uniterm: Uniterm): void {
    const baseUrl = 'http://localhost:8080/api/uniterms';
    const url = uniterm.id ? `${baseUrl}/${uniterm.id}` : baseUrl;
    const method = uniterm.id ? 'put' : 'post';
    console.log(`Trying direct HTTP ${method} to:`, url);
    this.http[method](url, uniterm).subscribe({
      next: (response) => {
        console.log(`Direct HTTP ${method} succeeded:`, response);
        this.loadUniterms();
      },
      error: (err) => console.error(`Direct HTTP ${method} failed:`, err),
    });
  }

  public handleMergeSelection(event: { index: number; result: string }): void {
    console.log('Merge selected:', event);
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
