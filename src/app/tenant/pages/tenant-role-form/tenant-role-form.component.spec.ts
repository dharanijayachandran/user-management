import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRoleFormComponent } from './tenant-role-form.component';

describe('TenantRoleFormComponent', () => {
  let component: TenantRoleFormComponent;
  let fixture: ComponentFixture<TenantRoleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantRoleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
