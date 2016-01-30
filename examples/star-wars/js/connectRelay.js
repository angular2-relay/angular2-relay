import { InputMetadata } from 'angular2/core';

export default function connectRelay() {
  return (target) => {
    Reflect.defineMetadata('propMetadata', {
      relayProps: [new InputMetadata()],
      route: [new InputMetadata()]
    }, target);

    const changeFn = target.prototype.ngOnChanges;

    const ngOnChanges = function (newState) {
      const route = newState.route ? newState.route.currentValue : this.route;
      const relayProps = newState.relayProps ? newState.relayProps.currentValue : this.relayProps;

      if (route && relayProps) {
        this.container.update({route: route, fragmentInput: relayProps});
      }
      if (changeFn) {
        changeFn.call(this, newState, 'hello');        
      }
    };

    target.prototype.ngOnChanges = ngOnChanges;

    return target;
  };
}
