import { InputMetadata } from 'angular2/core';

export default function connectRelay(config) {
  return (target) => {

    Reflect.defineMetadata('propMetadata', {
      relayProps: [new InputMetadata()],
      route: [new InputMetadata()]
    }, target);

    const changeFn = target.prototype.ngOnChanges;

    function ngOnChanges(newState) {
      const route = newState.route ? newState.route.currentValue : this.route;
      const relayProps = newState.relayProps ? newState.relayProps.currentValue : this.relayProps;

      if (route && relayProps) {
        this.container.update({route: route, fragmentInput: relayProps});
      }
      if (changeFn) {
        changeFn.call(this, newState);
      }
    };

    function initWithRelay() {
      this.relayData = {};

      const updateListener = (state) => {
        this.relayData = state.data;
      };
      this.container = new config.container(updateListener);
    }

    target.prototype.ngOnChanges = ngOnChanges;
    target.prototype.initWithRelay = initWithRelay;

    return target;
  };
}
