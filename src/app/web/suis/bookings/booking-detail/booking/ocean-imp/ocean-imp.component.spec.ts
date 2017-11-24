import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OceanImpComponent } from './ocean-imp.component';

describe('OceanImpComponent', () => {
  let component: OceanImpComponent;
  let fixture: ComponentFixture<OceanImpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OceanImpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OceanImpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
