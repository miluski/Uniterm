import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span
        >Systemu Informatyczny realizujący zamianę unitermu poziomej operacji
        zrównoleglania unitermów na pionową operację sekwencjowania
        unitermów</span
      >
      <span class="spacer"></span>
    </mat-toolbar>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
      .content {
        padding: 20px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'uniterm-web';
}
