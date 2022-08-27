import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaDisponiblePage } from './cita-disponible.page';

describe('CitaDisponiblePage', () => {
  let component: CitaDisponiblePage;
  let fixture: ComponentFixture<CitaDisponiblePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaDisponiblePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaDisponiblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
