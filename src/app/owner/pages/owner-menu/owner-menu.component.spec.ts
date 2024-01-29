import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ownerMenuComponent } from './owner-menu.component';

describe('OwnerMenuComponent', () => {
  let component: ownerMenuComponent;
  let fixture: ComponentFixture<ownerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ownerMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ownerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
