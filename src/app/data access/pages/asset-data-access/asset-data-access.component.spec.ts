import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDataAccessComponent } from './asset-data-access.component';

describe('AssetDataAccessComponent', () => {
  let component: AssetDataAccessComponent;
  let fixture: ComponentFixture<AssetDataAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDataAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
