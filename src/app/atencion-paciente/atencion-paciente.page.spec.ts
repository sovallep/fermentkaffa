import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionPacientePage } from './atencion-paciente.page';

describe('AtencionPacientePage', () => {
  let component: AtencionPacientePage;
  let fixture: ComponentFixture<AtencionPacientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtencionPacientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtencionPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
