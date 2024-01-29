import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFormViewComponent } from './role-form-view.component';

describe('RoleFormViewComponent', () => {
  let component: RoleFormViewComponent;
  let fixture: ComponentFixture<RoleFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
