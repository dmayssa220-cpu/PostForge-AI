import { TestBed } from '@angular/core/testing';

import { Generation } from './generation';

describe('Generation', () => {
  let service: Generation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Generation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
