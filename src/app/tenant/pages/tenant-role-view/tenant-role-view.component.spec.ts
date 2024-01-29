import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRoleViewComponent } from './tenant-role-view.component';

describe('TenantRoleViewComponent', () => {
  let component: TenantRoleViewComponent;
  let fixture: ComponentFixture<TenantRoleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantRoleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRoleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
