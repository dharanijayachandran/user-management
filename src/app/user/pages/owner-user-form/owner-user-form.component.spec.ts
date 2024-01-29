import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerUserFormComponent } from './owner-user-form.component';

describe('OwnerUserFormComponent', () => {
  let component: OwnerUserFormComponent;
  let fixture: ComponentFixture<OwnerUserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerUserFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
