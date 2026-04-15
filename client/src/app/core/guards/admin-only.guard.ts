import { CanMatchFn } from '@angular/router';

export const adminOnlyGuard: CanMatchFn = (route, segments) => {
  return true;
};
