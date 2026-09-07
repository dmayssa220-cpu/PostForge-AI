import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselViewer } from './carousel-viewer';

describe('CarouselViewer', () => {
  let component: CarouselViewer;
  let fixture: ComponentFixture<CarouselViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
