import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantAssignApplicationsComponent } from './tenant-assign-applications.component';

describe('TenantAssignApplicationsComponent', () => {
  let component: TenantAssignApplicationsComponent;
  let fixture: ComponentFixture<TenantAssignApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantAssignApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantAssignApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
