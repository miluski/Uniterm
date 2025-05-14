import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Uniterm } from '../models/uniterm.model';

@Component({
  selector: 'app-uniterm-visualization',
  template: `
    <div class="visualization-container">
      <canvas #visualizationCanvas [width]="canvasWidth" height="180"></canvas>

      <div *ngIf="!uniterms || uniterms.length === 0" class="empty-state">
        Brak wyrażeń do wyświetlenia
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule],
  styles: [
    `
      .visualization-container {
        padding: 10px;
        margin-bottom: 20px;
        background-color: #f9f9f9;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
      }

      .empty-state {
        padding: 20px;
        text-align: center;
        color: #757575;
      }

      canvas {
        display: block;
        margin: 0 auto;
      }
    `,
  ],
})
export class UnitermVisualisationComponent implements OnChanges, AfterViewInit {
  @Input() uniterms: Uniterm[] = [];
  @Input() operationType: string = 'PARALLEL';
  @Input() separator: string = ';';

  @ViewChild('visualizationCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx?: CanvasRenderingContext2D;

  protected canvasWidth: number = 400;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.canvasRef) {
        this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
        console.log('Canvas initialized, drawing visualization');
        this.drawVisualization();
      } else {
        console.error('Canvas reference not available');
      }
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      'Inputs changed:',
      this.operationType,
      'uniterms:',
      this.uniterms?.length
    );
    if (this.ctx) {
      this.drawVisualization();
    }
  }

  private drawVisualization(): void {
    if (!this.ctx) {
      console.error('Canvas context not initialized');
      return;
    }
    if (!this.uniterms || this.uniterms.length === 0) {
      console.warn('No uniterms to display');
      return;
    }
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.font = '16px Arial';
    console.log(
      `Drawing ${this.operationType} with ${this.uniterms.length} uniterms`
    );
    if (this.operationType === 'PARALLEL') {
      this.drawParallelOperation();
    } else {
      this.drawSequentialOperation();
    }
  }

  private drawParallelOperation(): void {
    if (!this.ctx) return;
    let contentWidth = 0;
    this.uniterms.forEach((uniterm, index) => {
      let text = uniterm.expression || uniterm.name || '';
      if (!text) text = `Item ${index + 1}`;
      const textWidth = this.ctx!.measureText(text).width;
      contentWidth += textWidth;
      if (index < this.uniterms.length - 1) {
        const separatorWidth = this.ctx!.measureText(this.separator).width;
        contentWidth += separatorWidth + 30;
      }
    });
    contentWidth += 60;
    const startX = 50;
    const startY = 90;
    const lineWidth = Math.min(contentWidth, 350);
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY - 40);
    this.ctx.lineTo(startX + lineWidth, startY - 40);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY - 40);
    this.ctx.lineTo(startX, startY - 20);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(startX + lineWidth, startY - 40);
    this.ctx.lineTo(startX + lineWidth, startY - 20);
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
    let currentX = startX + 20;
    this.uniterms.forEach((uniterm, index) => {
      let text = uniterm.expression || uniterm.name || '';
      if (!text) text = `Item ${index + 1}`;
      this.ctx!.fillStyle = '#000000';
      this.ctx!.fillText(text, currentX, startY + 5);
      const textWidth = this.ctx!.measureText(text).width;
      currentX += textWidth + 20;
      if (index < this.uniterms.length - 1) {
        this.ctx!.fillStyle = '#555555';
        this.ctx!.fillText(this.separator, currentX - 10, startY + 5);
        currentX += 15;
      }
    });
  }

  private drawSequentialOperation(): void {
    if (!this.ctx) return;
    const startX = 120;
    const startY = 40;
    const itemHeight = 40;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(startX - 30, startY);
    this.ctx.bezierCurveTo(
      startX - 60,
      startY,
      startX - 60,
      startY + this.uniterms.length * itemHeight,
      startX - 30,
      startY + this.uniterms.length * itemHeight
    );
    this.ctx.stroke();
    this.ctx.lineWidth = 1;
    let currentY = startY;
    this.uniterms.forEach((uniterm, index) => {
      let text = uniterm.expression || uniterm.name || '';
      if (!text) text = `Item ${index + 1}`;
      this.ctx!.fillStyle = '#000000';
      this.ctx!.fillText(text, startX, currentY + 15);
      currentY += itemHeight;
      if (index < this.uniterms.length - 1) {
        this.ctx!.fillStyle = '#555555';
        this.ctx!.fillText(this.separator, startX, currentY - 10);
      }
    });
  }
}
