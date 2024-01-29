import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRoleFormComponent } from './account-role-form.component';

describe('AccountRoleFormComponent', () => {
  let component: AccountRoleFormComponent;
  let fixture: ComponentFixture<AccountRoleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRoleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
