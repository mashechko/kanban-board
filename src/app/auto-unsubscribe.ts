import { ComponentDef, ComponentType } from './component-def';

export function AutoUnsubscribe(): Function {
  return (componentType: ComponentType<any>): void => {
    const component: ComponentDef<ComponentType<any>> = componentType.ɵcmp;

    if (!component) {
      throw new Error(`No angular property found for ${componentType.name}`);
    }

    const cmpOnDestroy: (() => void) | null = component.onDestroy;

    component.onDestroy = function () {
      if (this.unsubscribeStream$) {
        this.unsubscribeStream$.next();
        this.unsubscribeStream$.complete();
      }

      if (cmpOnDestroy !== null) {
        cmpOnDestroy.apply(this);
      }
    };
  };
}
