import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAddSearchUserComponent } from './export-add-search-user.component';

describe('ExportAddSearchUserComponent', () => {
  let component: ExportAddSearchUserComponent;
  let fixture: ComponentFixture<ExportAddSearchUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportAddSearchUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAddSearchUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
