import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitermListComponent } from './uniterm-list.component';

describe('UnitermListComponent', () => {
  let component: UnitermListComponent;
  let fixture: ComponentFixture<UnitermListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitermListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitermListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
