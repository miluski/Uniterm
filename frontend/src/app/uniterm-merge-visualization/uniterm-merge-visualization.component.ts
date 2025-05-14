import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Uniterm } from '../models/uniterm.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-uniterm-merge-visualization',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <div class="merge-visualization-container">
      <div class="previews">
        <div class="preview-row">
          <div class="preview-container">
            <h4>Zrównoleglenie poziome → Sekwencjonowanie pionowe</h4>
            <p>Zamiana za 1:</p>
            <canvas #mergedCanvas1 width="500" height="200"></canvas>
          </div>

          <div class="preview-container">
            <h4>Zrównoleglenie poziome → Sekwencjonowanie pionowe</h4>
            <p>Zamiana za 2:</p>
            <canvas #mergedCanvas2 width="500" height="200"></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .merge-visualization-container {
        margin: 20px 0;
      }

      .preview-row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 20px;
      }

      .preview-container {
        flex: 1 1 calc(50% - 10px);
        min-width: 300px;
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 5px;
        border: 1px solid #ddd;
        margin-bottom: 20px;
      }

      h4 {
        margin: 0 0 10px 0;
        color: #3f51b5;
        font-weight: 500;
      }

      p {
        margin: 5px 0;
        font-weight: 400;
        color: #555;
      }

      canvas {
        display: block;
        border: 1px solid #eee;
        background-color: white;
      }
    `,
  ],
})
export class UnitermMergeVisualizationComponent
  implements OnChanges, AfterViewInit
{
  @Input() parallelUniterms: Uniterm[] = [];
  @Input() sequentialUniterms: Uniterm[] = [];
  @Input() separator: string = ';';
  @Output() mergeSelected = new EventEmitter<{
    index: number;
    result: string;
  }>();

  @ViewChild('mergedCanvas1') mergedCanvas1Ref?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mergedCanvas2') mergedCanvas2Ref?: ElementRef<HTMLCanvasElement>;

  private mergedCtx1?: CanvasRenderingContext2D;
  private mergedCtx2?: CanvasRenderingContext2D;

  private readonly ELEMENT_SPACING = 35;
  private readonly SEPARATOR_SPACING = 15;
  private readonly MIN_BAR_LENGTH = 150;
  private readonly MAX_BAR_LENGTH = 300;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCanvasContexts();
      this.drawVisualizations();
    }, 100);
  }

  ngOnChanges() {
    setTimeout(() => {
      if (this.mergedCanvas1Ref && this.mergedCanvas2Ref) {
        this.initCanvasContexts();
        this.drawVisualizations();
      }
    }, 100);
  }

  private getParallelSeparator(): string {
    for (const uniterm of this.parallelUniterms) {
      if (uniterm?.separator) {
        return uniterm.separator;
      }
    }
    return this.separator;
  }

  private getSequentialSeparator(): string {
    for (const uniterm of this.sequentialUniterms) {
      if (uniterm?.sequentialSeparator) {
        return uniterm.sequentialSeparator;
      }
      if (uniterm?.separator) {
        return uniterm.separator;
      }
    }
    return this.separator;
  }

  private initCanvasContexts() {
    if (this.mergedCanvas1Ref) {
      const ctx1 = this.mergedCanvas1Ref.nativeElement.getContext('2d');
      if (ctx1) {
        this.mergedCtx1 = ctx1;
        this.mergedCtx1.font = '14px Arial';
      }
    }
    if (this.mergedCanvas2Ref) {
      const ctx2 = this.mergedCanvas2Ref.nativeElement.getContext('2d');
      if (ctx2) {
        this.mergedCtx2 = ctx2;
        this.mergedCtx2.font = '14px Arial';
      }
    }
  }

  private drawVisualizations() {
    if (!this.mergedCtx1 || !this.mergedCtx2) {
      return;
    }
    const canvas1 = this.mergedCanvas1Ref!.nativeElement;
    const canvas2 = this.mergedCanvas2Ref!.nativeElement;
    this.mergedCtx1.clearRect(0, 0, canvas1.width, canvas1.height);
    this.mergedCtx2.clearRect(0, 0, canvas2.width, canvas2.height);
    this.mergedCtx1.font = '14px Arial';
    this.mergedCtx2.font = '14px Arial';
    this.drawOption1();
    this.drawOption2();
    this.emitSelection();
  }

  private processText(text: string): string {
    if (!text) return '';
    return text;
  }

  private calculateBarLength(ctx: CanvasRenderingContext2D): number {
    let totalWidth = 0;
    this.parallelUniterms.forEach((uniterm, index) => {
      const text = this.processText(uniterm.expression || uniterm.name || '');
      totalWidth += ctx.measureText(text).width;
      if (index < this.parallelUniterms.length - 1) {
        const separator = this.getParallelSeparator();
        totalWidth +=
          ctx.measureText(separator).width + this.SEPARATOR_SPACING * 2;
      }
    });
    totalWidth += 80;
    return Math.max(
      this.MIN_BAR_LENGTH,
      Math.min(this.MAX_BAR_LENGTH, totalWidth)
    );
  }

  private drawOption1() {
    if (!this.mergedCtx1) return;
    const ctx = this.mergedCtx1;
    const barLength = this.calculateBarLength(ctx);
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.lineTo(50 + barLength, 30);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.lineTo(50, 45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50 + barLength, 30);
    ctx.lineTo(50 + barLength, 45);
    ctx.stroke();
    ctx.lineWidth = 1;
    const sequentialBracketX = 90;
    const bracketHeight = Math.max(
      35,
      this.sequentialUniterms.length * this.ELEMENT_SPACING
    );
    this.drawSequentialBracket(ctx, sequentialBracketX, 50, 100, bracketHeight);
    let y = 65;
    this.sequentialUniterms.forEach((uniterm, idx) => {
      let text = uniterm.expression || uniterm.name || `Item ${idx + 1}`;
      text = this.processText(text);
      ctx.fillStyle = '#000000';
      ctx.fillText(text, sequentialBracketX + 15, y);
      if (idx < this.sequentialUniterms.length - 1) {
        const sequentialSeparator = this.getSequentialSeparator();
        ctx.fillStyle = '#0000FF';
        ctx.fillText(sequentialSeparator, sequentialBracketX + 15, y + 20);
        ctx.fillStyle = '#000000';
        y += this.ELEMENT_SPACING;
      }
    });
    if (this.parallelUniterms.length > 1) {
      const sequentialWidth = this.getMaxSequentialTextWidth(ctx);
      const parallelSeparator = this.getParallelSeparator();
      ctx.fillStyle = '#0000FF';
      ctx.fillText(
        parallelSeparator,
        sequentialBracketX + sequentialWidth + 30,
        70
      );
      const text = this.processText(
        this.parallelUniterms[1]?.expression ||
          this.parallelUniterms[1]?.name ||
          ''
      );
      if (text) {
        ctx.fillStyle = '#000000';
        ctx.fillText(text, sequentialBracketX + sequentialWidth + 50, 70);
      }
    }
  }

  private drawOption2() {
    if (!this.mergedCtx2) return;
    const ctx = this.mergedCtx2;
    const barLength = this.calculateBarLength(ctx);
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.lineTo(50 + barLength, 30);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50, 30);
    ctx.lineTo(50, 45);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(50 + barLength, 30);
    ctx.lineTo(50 + barLength, 45);
    ctx.stroke();
    ctx.lineWidth = 1;
    if (this.parallelUniterms.length > 0) {
      const text = this.processText(
        this.parallelUniterms[0]?.expression ||
          this.parallelUniterms[0]?.name ||
          ''
      );
      if (text) {
        ctx.fillStyle = '#000000';
        ctx.fillText(text, 70, 70);
        const firstElementWidth = ctx.measureText(text).width;
        const parallelSeparator = this.getParallelSeparator();
        ctx.fillStyle = '#0000FF';
        ctx.fillText(parallelSeparator, 85 + firstElementWidth, 70);
      } else {
        ctx.fillStyle = '#0000FF';
        const parallelSeparator = this.getParallelSeparator();
        ctx.fillText(parallelSeparator, 100, 70);
      }
    }
    let sequentialX = 150;
    if (this.parallelUniterms.length > 0) {
      const text = this.processText(this.parallelUniterms[0]?.expression || '');
      if (text) {
        const textWidth = ctx.measureText(text).width;
        const separator = this.getParallelSeparator();
        const separatorWidth = ctx.measureText(separator).width;
        sequentialX = 100 + textWidth + separatorWidth + this.SEPARATOR_SPACING;
      }
    }
    const bracketHeight = Math.max(
      35,
      this.sequentialUniterms.length * this.ELEMENT_SPACING
    );
    this.drawSequentialBracket(ctx, sequentialX, 50, 100, bracketHeight);
    let y = 65;
    this.sequentialUniterms.forEach((uniterm, idx) => {
      const text = this.processText(
        uniterm.expression || uniterm.name || `Item ${idx + 1}`
      );
      ctx.fillStyle = '#000000';
      ctx.fillText(text, sequentialX + 20, y);
      if (idx < this.sequentialUniterms.length - 1) {
        const sequentialSeparator = this.getSequentialSeparator();
        ctx.fillStyle = '#0000FF';
        ctx.fillText(sequentialSeparator, sequentialX + 20, y + 20);
        ctx.fillStyle = '#000000';
        y += this.ELEMENT_SPACING;
      }
    });
  }

  private drawSequentialBracket(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 20, y, x - 20, y + height, x, y + height);
    ctx.stroke();
  }

  private getMaxSequentialTextWidth(ctx: CanvasRenderingContext2D): number {
    let maxWidth = 0;
    this.sequentialUniterms.forEach((uniterm) => {
      const text = this.processText(uniterm.expression || uniterm.name || '');
      const textWidth = ctx.measureText(text).width;
      maxWidth = Math.max(maxWidth, textWidth);
    });
    return maxWidth;
  }

  private emitSelection() {
    const sequentialText = this.buildSequentialText();
    let result1: string;
    if (
      this.parallelUniterms.length > 0 &&
      this.sequentialUniterms.length > 0
    ) {
      result1 = `Replace position 1 (${this.processText(
        this.parallelUniterms[0]?.expression || ''
      )}) with sequential operation (${sequentialText})`;
    } else {
      result1 = 'No content available for merge';
    }
    this.mergeSelected.emit({
      index: 0,
      result: result1,
    });
  }

  private buildSequentialText(): string {
    if (this.sequentialUniterms.length === 0) return 'No content';
    let result = '';
    this.sequentialUniterms.forEach((uniterm, index) => {
      const text = this.processText(uniterm.expression || uniterm.name || '');
      result += text;
      if (index < this.sequentialUniterms.length - 1) {
        const separator = this.getSequentialSeparator();
        result += ` ${separator} `;
      }
    });

    return result;
  }
}
