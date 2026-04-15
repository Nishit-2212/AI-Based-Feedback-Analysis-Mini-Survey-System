import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { adminOnlyGuard } from './admin-only.guard';

describe('adminOnlyGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
