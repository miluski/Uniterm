import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Uniterm,
  OperationType,
  UnitermElement,
} from '../models/uniterm.model';

@Component({
  selector: 'app-uniterm-visualization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualization-container">
      <canvas #unitermCanvas width="800" height="600"></canvas>
    </div>
  `,
  styles: [
    `
      .visualization-container {
        border: 1px solid #ccc;
        margin: 10px 0;
        background-color: white;
      }
    `,
  ],
})
export class UnitermVisualizationComponent implements OnInit, OnChanges {
  @Input() uniterm?: Uniterm;
  @Input() fontFamily: string = 'Arial';
  @Input() fontSize: number = 14;

  @ViewChild('unitermCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.redraw();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['uniterm'] || changes['fontFamily'] || changes['fontSize']) {
      this.redraw();
    }
  }

  redraw() {
    if (!this.ctx || !this.uniterm) return;
    this.ctx.clearRect(
      0,
      0,
      this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height
    );
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    if (this.uniterm.operationType == OperationType.PARALLEL) {
      this.drawParallelUniterm();
    } else if (this.uniterm.operationType == OperationType.SEQUENCE) {
      this.drawSequentialUniterm();
    }
  }

  drawParallelUniterm() {
    if (!this.uniterm || !this.ctx) return;
    const elements = this.uniterm.elements;
    if (elements.length === 0) {
      this.ctx.fillText('Dodaj elementy do unitermu', 50, 50);
      return;
    }
    const startX = 50;
    const startY = 100;
    const padding = 20;
    let combinedText = '';
    elements.forEach((element, index) => {
      combinedText += `${element.expressionA} ; ${element.expressionB}`;
      if (index < elements.length - 1) {
        combinedText += ' ; ';
      }
    });
    const textWidth = this.ctx.measureText(combinedText).width;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = this.fontSize * 2;
    this.ctx.fillText('zrównoleglenie poziome', startX, startY - 20);
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX + boxWidth, startY);
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX, startY + boxHeight / 2);
    this.ctx.moveTo(startX + boxWidth, startY);
    this.ctx.lineTo(startX + boxWidth, startY + boxHeight / 2);
    this.ctx.stroke();
    this.ctx.fillText(
      combinedText,
      startX + padding,
      startY + boxHeight / 2 + 5
    );
  }
  
  drawSequentialUniterm() {
    if (!this.uniterm || !this.ctx) return;
    const elements = this.uniterm.elements;
    if (elements.length === 0) return;
    const startX = 100;
    const startY = 50;
    const padding = 20;
    const spacing = 30;
    let currentY = startY;
    elements.forEach((element, index) => {
      this.ctx.fillText(element.expressionA, startX + padding, currentY + this.fontSize);
      currentY += spacing;
      this.ctx.fillText(';', startX + padding, currentY + this.fontSize);
      currentY += spacing;
      this.ctx.fillText(element.expressionB, startX + padding, currentY + this.fontSize);
      if (index < elements.length - 1) {
        currentY += spacing * 2;
      }
    });
    this.drawCurvedBracket(
      startX - 10,
      startY - 10,
      currentY - startY + this.fontSize * 2
    );
    this.ctx.fillText(
      'sekwencjonowanie pionowe',
      startX,
      currentY + this.fontSize * 3
    );
  }

  drawCurvedBracket(x: number, y: number, height: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.bezierCurveTo(
      x - 20,
      y + height / 4,
      x - 20,
      y + (3 * height) / 4,
      x,
      y + height
    );
    this.ctx.stroke();
  }

  drawVerticalBracket(x: number, y: number, height: number, width: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y + height);
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + width, y);
    this.ctx.moveTo(x, y + height);
    this.ctx.lineTo(x + width, y + height);
    this.ctx.stroke();
  }
}
