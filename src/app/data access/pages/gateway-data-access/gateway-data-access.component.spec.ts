import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayDataAccessComponent } from './gateway-data-access.component';

describe('GatewayDataAccessComponent', () => {
  let component: GatewayDataAccessComponent;
  let fixture: ComponentFixture<GatewayDataAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayDataAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
