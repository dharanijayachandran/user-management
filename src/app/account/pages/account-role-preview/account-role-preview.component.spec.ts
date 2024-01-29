import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRolePreviewComponent } from './account-role-preview.component';

describe('AccountRolePreviewComponent', () => {
  let component: AccountRolePreviewComponent;
  let fixture: ComponentFixture<AccountRolePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRolePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRolePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
