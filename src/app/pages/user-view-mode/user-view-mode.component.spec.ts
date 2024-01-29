import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewModeComponent } from './user-view-mode.component';

describe('UserViewModeComponent', () => {
  let component: UserViewModeComponent;
  let fixture: ComponentFixture<UserViewModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserViewModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
