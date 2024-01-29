import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDataAccessComponent } from './dashboard-data-access.component';

describe('DashboardDataAccessComponent', () => {
  let component: DashboardDataAccessComponent;
  let fixture: ComponentFixture<DashboardDataAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDataAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
