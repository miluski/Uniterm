import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
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
      <div class="actions">
        <button
          mat-raised-button
          color="primary"
          [disabled]="
            parallelUniterms.length < 1 || sequentialUniterms.length < 1
          "
          (click)="selectReplacement(0)"
        >
          Zamiana za 1
        </button>

        <button
          mat-raised-button
          color="primary"
          [disabled]="
            parallelUniterms.length < 2 || sequentialUniterms.length < 1
          "
          (click)="selectReplacement(1)"
        >
          Zamiana za 2
        </button>

        <div class="previews" *ngIf="showPreview">
          <div class="preview-row">
            <div
              class="preview-container"
              *ngIf="selectedReplacementIndex === 0"
            >
              <h3>Wynik</h3>
              <h4>Zamiana za 1:</h4>
              <canvas #mergedCanvas1 width="500" height="200"></canvas>
            </div>

            <div
              class="preview-container"
              *ngIf="selectedReplacementIndex === 1"
            >
              <h3>Wynik</h3>
              <h4>Zamiana za 2:</h4>
              <canvas #mergedCanvas2 width="500" height="200"></canvas>
            </div>
          </div>

          <button mat-button color="warn" (click)="resetMerge()">Reset</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .merge-visualization-container {
        margin: 20px 0;
      }

      .operations-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .operation-container {
        flex: 1;
        max-width: 45%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }

      .actions {
        display: flex;
        gap: 20px;
        margin: 20px 0;
      }

      .previews {
        margin-top: 30px;
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 5px;
      }

      .preview-container {
        margin-bottom: 20px;
      }

      h4 {
        margin: 5px 0;
        font-weight: 500;
      }
    `,
  ],
})
export class UnitermMergeVisualizationComponent implements OnInit, OnChanges {
  @Input() parallelUniterms: Uniterm[] = [];
  @Input() sequentialUniterms: Uniterm[] = [];
  @Input() separator: string = ';';
  @Output() mergeSelected = new EventEmitter<{
    index: number;
    result: string;
  }>();

  @ViewChild('parallelCanvas', { static: true })
  parallelCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sequentialCanvas', { static: true })
  sequentialCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mergedCanvas1') mergedCanvas1Ref?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mergedCanvas2') mergedCanvas2Ref?: ElementRef<HTMLCanvasElement>;

  private parallelCtx!: CanvasRenderingContext2D;
  private sequentialCtx!: CanvasRenderingContext2D;
  private mergedCtx1?: CanvasRenderingContext2D;
  private mergedCtx2?: CanvasRenderingContext2D;

  protected showPreview = false;
  protected selectedReplacementIndex: number = -1;

  public ngOnInit() {
    this.parallelCtx = this.parallelCanvasRef.nativeElement.getContext('2d')!;
    this.sequentialCtx =
      this.sequentialCanvasRef.nativeElement.getContext('2d')!;
    this.redrawParallel();
    this.redrawSequential();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['parallelUniterms'] || changes['sequentialUniterms']) {
      this.redrawParallel();
      this.redrawSequential();
      this.resetMerge();
    }
  }

  public redrawParallel() {
    if (!this.parallelCtx) return;
    this.parallelCtx.clearRect(
      0,
      0,
      this.parallelCanvasRef.nativeElement.width,
      this.parallelCanvasRef.nativeElement.height
    );
    this.parallelCtx.font = '14px Arial';
    this.drawParallelOperation(this.parallelCtx, this.parallelUniterms, 50, 80);
  }

  public redrawSequential() {
    if (!this.sequentialCtx) return;
    this.sequentialCtx.clearRect(
      0,
      0,
      this.sequentialCanvasRef.nativeElement.width,
      this.sequentialCanvasRef.nativeElement.height
    );
    this.sequentialCtx.font = '14px Arial';
    this.drawSequentialOperation(
      this.sequentialCtx,
      this.sequentialUniterms,
      120,
      50
    );
  }

  public selectReplacement(index: number) {
    this.selectedReplacementIndex = index;
    this.showPreview = true;
    setTimeout(() => {
      if (index === 0 && this.mergedCanvas1Ref) {
        this.mergedCtx1 = this.mergedCanvas1Ref.nativeElement.getContext('2d')!;
        this.drawMergedVisualization(0);
      } else if (index === 1 && this.mergedCanvas2Ref) {
        this.mergedCtx2 = this.mergedCanvas2Ref.nativeElement.getContext('2d')!;
        this.drawMergedVisualization(1);
      }
    }, 100);
    const parallelText = this.parallelUniterms
      .map((u) => u.expression)
      .join(` ${this.separator} `);
    const sequentialText = this.sequentialUniterms
      .map((u) => u.expression)
      .join(` ${this.separator} `);
    this.mergeSelected.emit({
      index,
      result:
        index === 0
          ? `Replace position 1 (${this.parallelUniterms[0]?.expression}) with sequential operation (${sequentialText})`
          : `Replace position 2 (${this.parallelUniterms[1]?.expression}) with sequential operation (${sequentialText})`,
    });
  }

  public resetMerge() {
    this.showPreview = false;
    this.selectedReplacementIndex = -1;
  }

  public drawParallelOperation(
    ctx: CanvasRenderingContext2D,
    uniterms: Uniterm[],
    startX: number,
    startY: number
  ) {
    if (uniterms.length === 0) {
      ctx.fillText('No parallel expressions', startX, startY);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(startX, startY - 30);
    ctx.lineTo(startX + 150, startY - 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(startX, startY - 30);
    ctx.lineTo(startX, startY - 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(startX + 150, startY - 30);
    ctx.lineTo(startX + 150, startY - 15);
    ctx.stroke();
    const text = uniterms.map((u) => u.expression).join(` ${this.separator} `);
    ctx.fillText(text, startX + 20, startY);
    ctx.fillText('zrównoleglenie poziome', startX, startY + 30);
  }

  public drawSequentialOperation(
    ctx: CanvasRenderingContext2D,
    uniterms: Uniterm[],
    startX: number,
    startY: number
  ) {
    if (uniterms.length === 0) {
      ctx.fillText('No sequential expressions', startX, startY);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(
      startX - 20,
      startY,
      startX - 20,
      startY + (uniterms.length * 30 + 20),
      startX,
      startY + (uniterms.length * 30 + 20)
    );
    ctx.stroke();
    uniterms.forEach((uniterm, index) => {
      ctx.fillText(uniterm.expression, startX + 15, startY + index * 30 + 20);
      if (index < uniterms.length - 1) {
        ctx.fillText(this.separator, startX + 15, startY + index * 30 + 35);
      }
    });
  }

  public drawMergedVisualization(index: number) {
    const ctx = index === 0 ? this.mergedCtx1 : this.mergedCtx2;
    if (!ctx) return;
    const canvas =
      index === 0
        ? this.mergedCanvas1Ref!.nativeElement
        : this.mergedCanvas2Ref!.nativeElement;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px Arial';
    const startX = 80;
    const startY = 80;
    if (index === 0) {
      ctx.beginPath();
      ctx.moveTo(startX, startY - 30);
      ctx.lineTo(startX + 200, startY - 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(startX, startY - 30);
      ctx.lineTo(startX, startY - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(startX + 200, startY - 30);
      ctx.lineTo(startX + 200, startY - 15);
      ctx.stroke();
      this.drawSequentialOperation(
        ctx,
        this.sequentialUniterms,
        startX + 30,
        startY - 10
      );
      ctx.fillText(this.separator, startX + 100, startY);
      if (this.parallelUniterms.length > 1) {
        ctx.fillText(this.parallelUniterms[1].expression, startX + 120, startY);
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(startX, startY - 30);
      ctx.lineTo(startX + 200, startY - 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(startX, startY - 30);
      ctx.lineTo(startX, startY - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(startX + 200, startY - 30);
      ctx.lineTo(startX + 200, startY - 15);
      ctx.stroke();
      if (this.parallelUniterms.length > 0) {
        ctx.fillText(this.parallelUniterms[0].expression, startX + 20, startY);
      }
      ctx.fillText(this.separator, startX + 80, startY);
      this.drawSequentialOperation(
        ctx,
        this.sequentialUniterms,
        startX + 100,
        startY - 10
      );
    }
  }
}
