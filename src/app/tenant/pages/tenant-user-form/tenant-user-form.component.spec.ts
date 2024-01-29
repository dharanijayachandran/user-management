import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUserFormComponent } from './tenant-user-form.component';

describe('TenantUserFormComponent', () => {
  let component: TenantUserFormComponent;
  let fixture: ComponentFixture<TenantUserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantUserFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
