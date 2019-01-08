import { TestBed, async, inject } from '@angular/core/testing';

import { ContentGuard } from './content.guard';

describe('ContentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentGuard]
    });
  });

  it('should ...', inject([ContentGuard], (guard: ContentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
