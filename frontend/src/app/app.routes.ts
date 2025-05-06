import { Routes } from '@angular/router';
import { UnitermVisualizationControllerComponent } from './uniterm-visualisation-controller/uniterm-visualisation-controller.component';

export const routes: Routes = [
  { path: '', redirectTo: 'visualize', pathMatch: 'full' },
  { path: 'visualize', component: UnitermVisualizationControllerComponent },
  { path: '**', redirectTo: 'visualize' }
];