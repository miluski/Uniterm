import { Routes } from '@angular/router';
import { UnitermVisualisationControllerComponent } from './uniterm-visualisation-controller/uniterm-visualisation-controller.component';

export const routes: Routes = [
  { path: '', redirectTo: 'visualize', pathMatch: 'full' },
  { path: 'visualize', component: UnitermVisualisationControllerComponent },
  { path: '**', redirectTo: 'visualize' }
];