

import { OwnerUserComponent } from './owner-user.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

describe('OwnerUserComponent', () => {
  let component: OwnerUserComponent;
  let fixture: ComponentFixture<OwnerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
