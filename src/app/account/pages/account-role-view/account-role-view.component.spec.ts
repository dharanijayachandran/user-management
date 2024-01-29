import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRoleViewComponent } from './account-role-view.component';

describe('AccountRoleViewComponent', () => {
  let component: AccountRoleViewComponent;
  let fixture: ComponentFixture<AccountRoleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRoleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRoleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
