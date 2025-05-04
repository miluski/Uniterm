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
    console.log(this.uniterm.operationType == OperationType.PARALLEL);
    if (this.uniterm.operationType === OperationType.PARALLEL) {
      this.drawParallelUniterm();
    } else if (this.uniterm.operationType === OperationType.SEQUENCE) {
      this.drawSequentialUniterm();
    }
  }

  drawParallelUniterm() {
    if (!this.uniterm || !this.ctx) return;
    const elements = this.uniterm.elements;
    if (elements.length === 0) return;

    // Parameters for drawing
    const startX = 50;
    const startY = 100;
    const padding = 20;
    const spacing = 40;

    let totalWidth = 0;
    let maxHeight = 0;

    // Calculate text dimensions for all elements
    const elementDimensions = elements.map((element) => {
      const expressionA = element.expressionA;
      const expressionB = element.expressionB;

      const textA = this.ctx.measureText(expressionA);
      const textB = this.ctx.measureText(expressionB);

      const width = Math.max(textA.width, textB.width) + padding * 2;
      const height = this.fontSize * 3 + padding;

      maxHeight = Math.max(maxHeight, height);

      return { width, height };
    });

    // Calculate total width
    totalWidth =
      elementDimensions.reduce((sum, dim) => sum + dim.width, 0) +
      spacing * (elements.length - 1);

    // Draw elements side by side horizontally
    let currentX = startX;
    elements.forEach((element, index) => {
      const dim = elementDimensions[index];

      // Draw individual element container
      this.ctx.strokeRect(currentX, startY, dim.width, maxHeight);

      // Draw expression A on top
      this.ctx.fillText(
        element.expressionA,
        currentX + padding,
        startY + this.fontSize + 10
      );

      // Draw horizontal line between A and B
      this.ctx.beginPath();
      this.ctx.moveTo(currentX + 5, startY + this.fontSize + 20);
      this.ctx.lineTo(currentX + dim.width - 5, startY + this.fontSize + 20);
      this.ctx.stroke();

      // Draw expression B below
      this.ctx.fillText(
        element.expressionB,
        currentX + padding,
        startY + this.fontSize * 2 + 20
      );

      // If not the last element, draw connector
      if (index < elements.length - 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(currentX + dim.width, startY + maxHeight / 2);
        this.ctx.lineTo(
          currentX + dim.width + spacing / 2,
          startY + maxHeight / 2
        );
        this.ctx.stroke();
      }

      // Move to next element position
      currentX += dim.width + spacing;
    });

    // Add label
    this.ctx.fillText('zrównoleglenie poziome', startX, startY - 20);
  }

  drawSequentialUniterm() {
    if (!this.uniterm || !this.ctx) return;
    const elements = this.uniterm.elements;
    if (elements.length === 0) return;

    // Parameters for drawing
    const startX = 100;
    const startY = 50;
    const padding = 20;
    const spacing = 40;

    let maxWidth = 0;
    let totalHeight = 0;

    // Calculate text dimensions for all elements
    const elementDimensions = elements.map((element) => {
      const expressionA = element.expressionA;
      const expressionB = element.expressionB;

      const textA = this.ctx.measureText(expressionA);
      const textB = this.ctx.measureText(expressionB);

      const width = Math.max(textA.width, textB.width) + padding * 2;
      const height = this.fontSize * 3 + padding; // Space for A, semicolon, and B

      maxWidth = Math.max(maxWidth, width);

      return { width, height };
    });

    // Calculate total height
    totalHeight =
      elementDimensions.reduce((sum, dim) => sum + dim.height, 0) +
      spacing * (elements.length - 1);

    // Draw elements stacked vertically
    let currentY = startY;
    elements.forEach((element, index) => {
      const dim = elementDimensions[index];

      // Draw expression A at the top
      this.ctx.fillText(element.expressionA, startX, currentY + this.fontSize);

      // Draw semicolon in the middle
      this.ctx.fillText(';', startX, currentY + this.fontSize * 2);

      // Draw expression B below
      this.ctx.fillText(
        element.expressionB,
        startX,
        currentY + this.fontSize * 3
      );

      // Move to next element position
      currentY += dim.height + spacing;
    });

    // Draw the bracket connecting all elements
    this.drawVerticalBracket(startX - 20, startY - 10, totalHeight + 20, 10);

    // Add label
    this.ctx.fillText(
      'sekwencjonowanie pionowe',
      startX,
      startY + totalHeight + 30
    );
  }

  drawVerticalBracket(x: number, y: number, height: number, width: number) {
    this.ctx.beginPath();
    // Draw left vertical line
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y + height);

    // Draw top horizontal line
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + width, y);

    // Draw bottom horizontal line
    this.ctx.moveTo(x, y + height);
    this.ctx.lineTo(x + width, y + height);

    this.ctx.stroke();
  }
}
