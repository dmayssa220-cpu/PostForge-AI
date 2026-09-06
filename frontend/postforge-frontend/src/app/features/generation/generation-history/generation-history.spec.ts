import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationHistory } from './generation-history';

describe('GenerationHistory', () => {
  let component: GenerationHistory;
  let fixture: ComponentFixture<GenerationHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerationHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
