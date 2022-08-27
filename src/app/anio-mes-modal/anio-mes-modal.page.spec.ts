import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnioMesModalPage } from './anio-mes-modal.page';

describe('AnioMesModalPage', () => {
  let component: AnioMesModalPage;
  let fixture: ComponentFixture<AnioMesModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnioMesModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnioMesModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
