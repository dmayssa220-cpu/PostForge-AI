import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationForm } from './generation-form';

describe('GenerationForm', () => {
  let component: GenerationForm;
  let fixture: ComponentFixture<GenerationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
