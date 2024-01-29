import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOnHistoryComponent } from './sign-on-history.component';

describe('SignOnHistoryComponent', () => {
  let component: SignOnHistoryComponent;
  let fixture: ComponentFixture<SignOnHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignOnHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOnHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
