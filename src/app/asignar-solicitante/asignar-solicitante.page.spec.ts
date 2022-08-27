import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSolicitantePage } from './asignar-solicitante.page';

describe('AsignarSolicitantePage', () => {
  let component: AsignarSolicitantePage;
  let fixture: ComponentFixture<AsignarSolicitantePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarSolicitantePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarSolicitantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
