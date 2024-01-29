import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRoleComponent } from './tenant-role.component';

describe('TenantRoleComponent', () => {
  let component: TenantRoleComponent;
  let fixture: ComponentFixture<TenantRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
