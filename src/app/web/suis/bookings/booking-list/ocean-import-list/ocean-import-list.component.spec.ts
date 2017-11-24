import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OceanImportListComponent } from './ocean-import-list.component';

describe('OceanImportListComponent', () => {
  let component: OceanImportListComponent;
  let fixture: ComponentFixture<OceanImportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OceanImportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OceanImportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
