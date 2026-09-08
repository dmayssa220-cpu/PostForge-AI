import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialCalendar } from './editorial-calendar';

describe('EditorialCalendar', () => {
  let component: EditorialCalendar;
  let fixture: ComponentFixture<EditorialCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorialCalendar],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorialCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
