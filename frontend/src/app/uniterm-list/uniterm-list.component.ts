import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AddUnitermDialogComponent } from '../add-uniterm-dialog/add-uniterm-dialog.component';
import { OperationType, Uniterm } from '../models/uniterm.model';
import { UnitermService } from '../services/uniterm.service';
import { UnitermEditorComponent } from '../uniterm-editor/uniterm-editor.component';

@Component({
  selector: 'app-uniterm-list',
  templateUrl: './uniterm-list.component.html',
  styleUrls: ['./uniterm-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    UnitermEditorComponent,
  ],
})
export class UnitermListComponent implements OnInit {
  uniterms: Uniterm[] = [];
  selectedUniterm?: Uniterm;

  constructor(
    private unitermService: UnitermService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUniterms();
  }

  loadUniterms(): void {
    this.unitermService
      .getUniterms()
      .subscribe((uniterms: Uniterm[]) => (this.uniterms = uniterms));
  }

  selectUniterm(uniterm: Uniterm): void {
    this.selectedUniterm = uniterm;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUnitermDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unitermService.saveUniterm(result).subscribe(() => {
          this.loadUniterms();
        });
      }
    });
  }
}
