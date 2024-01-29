import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUserRoleComponent } from './account-user-role.component';

describe('AccountUserRoleComponent', () => {
  let component: AccountUserRoleComponent;
  let fixture: ComponentFixture<AccountUserRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountUserRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
