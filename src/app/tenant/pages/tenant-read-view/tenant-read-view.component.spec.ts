import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantReadViewComponent } from './tenant-read-view.component';

describe('TenantReadViewComponent', () => {
  let component: TenantReadViewComponent;
  let fixture: ComponentFixture<TenantReadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantReadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantReadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
