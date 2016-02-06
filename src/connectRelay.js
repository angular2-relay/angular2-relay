import { InputMetadata } from 'angular2/core';

export function connectRelay(config) {
  return (target) => {
    const decoratedTarget = target;

    Reflect.defineMetadata('propMetadata', {
      relayProps: [new InputMetadata()],
      route: [new InputMetadata()],
    }, target);

    const changeFn = target.prototype.ngOnChanges;

    function ngOnChanges(newState) {
      const route = newState.route ? newState.route.currentValue : this.route;
      const relayProps = newState.relayProps ? newState.relayProps.currentValue : this.relayProps;

      if (route && relayProps) {
        this.container.update({ route, fragmentInput: relayProps });
      }
      if (changeFn) {
        changeFn.call(this, newState);
      }
    }

    function initWithRelay(ngZone) {
      this.relayData = {};

      const updateListener = (state) => {
        ngZone.run(() => this.relayData = state.data);
      };
      this.container = new config.container(updateListener);
    }

    decoratedTarget.prototype.ngOnChanges = ngOnChanges;
    decoratedTarget.prototype.initWithRelay = initWithRelay;

    return decoratedTarget;
  };
}
