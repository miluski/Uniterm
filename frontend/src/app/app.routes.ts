import { Routes } from '@angular/router';
import { UnitermListComponent } from './uniterm-list/uniterm-list.component';
import { UnitermEditorComponent } from './uniterm-editor/uniterm-editor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'uniterms', pathMatch: 'full' },
  { path: 'uniterms', component: UnitermListComponent },
  { path: 'uniterms/:id', component: UnitermEditorComponent },
  { path: '**', redirectTo: 'uniterms' }
];