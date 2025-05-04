import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitermDialogComponent } from './add-uniterm-dialog.component';

describe('AddUnitermDialogComponent', () => {
  let component: AddUnitermDialogComponent;
  let fixture: ComponentFixture<AddUnitermDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUnitermDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUnitermDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
