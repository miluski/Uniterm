import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Uniterm, OperationType } from '../models/uniterm.model';

@Component({
  selector: 'app-uniterm-visualization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualization-container">
      <canvas #visualizationCanvas width="400" height="200"></canvas>
    </div>
  `,
  styles: [`
    .visualization-container {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 20px;
    }
  `]
})
export class UnitermVisualizationComponent implements OnInit, OnChanges {
  @Input() uniterms: Uniterm[] = [];
  @Input() operationType: 'PARALLEL' | 'SEQUENCE' = 'PARALLEL';
  @Input() separator: string = ';';
  
  @ViewChild('visualizationCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  
  public ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.redraw();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if ((changes['uniterms'] || changes['operationType'] || changes['separator']) && this.ctx) {
      this.redraw();
    }
  }
  
  public redraw() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.ctx.font = '14px Arial';
    if (this.operationType === 'PARALLEL') {
      this.drawParallelOperation();
    } else {
      this.drawSequentialOperation();
    }
  }
  
  public drawParallelOperation() {
    const startX = 50;
    const startY = 100;
    if (this.uniterms.length === 0) {
      this.ctx.fillText("Nie wybrano wyrażeń", startX, startY);
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY - 30);
    this.ctx.lineTo(startX + 150, startY - 30);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY - 30);
    this.ctx.lineTo(startX, startY - 15);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(startX + 150, startY - 30);
    this.ctx.lineTo(startX + 150, startY - 15);
    this.ctx.stroke();
    const text = this.uniterms.map(u => u.expression).join(` ${this.separator} `);
    this.ctx.fillText(text, startX + 20, startY);
  }
  
  public drawSequentialOperation() {
    const startX = 50;
    const startY = 50;
    if (this.uniterms.length === 0) {
      this.ctx.fillText("Nie wybrano wyrażeń", startX, startY);
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.bezierCurveTo(
      startX - 20, startY,
      startX - 20, startY + (this.uniterms.length * 30 + 20),
      startX, startY + (this.uniterms.length * 30 + 20)
    );
    this.ctx.stroke();
    this.uniterms.forEach((uniterm, index) => {
      this.ctx.fillText(uniterm.expression, startX + 15, startY + (index * 30) + 20);
      if (index < this.uniterms.length - 1) {
        this.ctx.fillText(this.separator, startX + 15, startY + (index * 30) + 35);
      }
    });
  }
}