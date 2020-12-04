import { ɵComponentDef, ɵComponentType } from '@angular/core';

export interface ComponentDef<T> extends ɵComponentDef<T> {
  factory: FactoryFn<T>;
  onDestroy: (() => void) | null;
  onInit: (() => void) | null;
}

export type FactoryFn<T> = {
  <U extends T>(t: ComponentType<U>): U;
  (t?: undefined): T;
};
export type ComponentType<T> = ɵComponentType<T>;
