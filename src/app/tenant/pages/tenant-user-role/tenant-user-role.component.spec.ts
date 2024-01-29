import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUserRoleComponent } from './tenant-user-role.component';

describe('TenantUserRoleComponent', () => {
  let component: TenantUserRoleComponent;
  let fixture: ComponentFixture<TenantUserRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantUserRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
