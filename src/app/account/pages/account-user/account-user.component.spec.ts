import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUserComponent } from './account-user.component';

describe('AccountUserComponent', () => {
  let component: AccountUserComponent;
  let fixture: ComponentFixture<AccountUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
