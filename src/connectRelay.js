import { InputMetadata, NgZone } from 'angular2/core';

export function connectRelay(config) {
  return (target) => {
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

    function initWithRelay(relayData = {}) {
      const ngZone = new NgZone({});
      const updateListener = (state) => {
        ngZone.run(() => this.relayData = state.data);
      };
      this.container = new config.container(updateListener);
      this.relayData = relayData;
    }

    target.prototype.ngOnChanges = ngOnChanges;
    target.prototype.initWithRelay = initWithRelay;

    return target;
  };
}
