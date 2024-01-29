import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDataAccessComponent } from './manage-data-access.component';

describe('ManageDataAccessComponent', () => {
  let component: ManageDataAccessComponent;
  let fixture: ComponentFixture<ManageDataAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDataAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
