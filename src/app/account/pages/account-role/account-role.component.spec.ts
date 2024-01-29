import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRoleComponent } from './account-role.component';

describe('AccountRoleComponent', () => {
  let component: AccountRoleComponent;
  let fixture: ComponentFixture<AccountRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
