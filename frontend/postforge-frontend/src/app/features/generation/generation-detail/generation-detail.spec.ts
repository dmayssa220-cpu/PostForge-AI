import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationDetail } from './generation-detail';

describe('GenerationDetail', () => {
  let component: GenerationDetail;
  let fixture: ComponentFixture<GenerationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerationDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
