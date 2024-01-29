import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRoleReadViewComponent } from './account-role-read-view.component';

describe('AccountRoleReadViewComponent', () => {
  let component: AccountRoleReadViewComponent;
  let fixture: ComponentFixture<AccountRoleReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRoleReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRoleReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
