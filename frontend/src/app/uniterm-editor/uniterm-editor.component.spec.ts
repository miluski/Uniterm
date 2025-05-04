import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitermEditorComponent } from './uniterm-editor.component';

describe('UnitermEditorComponent', () => {
  let component: UnitermEditorComponent;
  let fixture: ComponentFixture<UnitermEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitermEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitermEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
