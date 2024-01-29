import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePreviewComponent } from './role-preview.component';

describe('RolePreviewComponent', () => {
  let component: RolePreviewComponent;
  let fixture: ComponentFixture<RolePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
