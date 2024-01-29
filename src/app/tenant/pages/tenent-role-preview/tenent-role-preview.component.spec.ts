import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenentRolePreviewComponent } from './tenent-role-preview.component';

describe('TenentRolePreviewComponent', () => {
  let component: TenentRolePreviewComponent;
  let fixture: ComponentFixture<TenentRolePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenentRolePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenentRolePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
