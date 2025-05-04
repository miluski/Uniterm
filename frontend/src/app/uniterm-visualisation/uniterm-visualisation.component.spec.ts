import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitermVisualisationComponent } from './uniterm-visualisation.component';

describe('UnitermVisualisationComponent', () => {
  let component: UnitermVisualisationComponent;
  let fixture: ComponentFixture<UnitermVisualisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitermVisualisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitermVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
