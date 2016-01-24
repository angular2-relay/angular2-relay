import Relay from 'generic-relay';
import { Component, Input } from 'angular2/core';

const StarWarsShipContainer = Relay.createGenericContainer('StarWarsShip', {
  fragments: {
    ship: () => Relay.QL`
       fragment on Ship {
         name
       }
    `,
  },
});

@Component({
  selector: 'star-wars-ship',
  template: `<div>{{ ship.name }}</div>`
})
class StarWarsShip {
  @Input() route = '';
  @Input() relayProps = '';

  constructor() {
    this.ship = {};

    const updateListener = (state) => {
      this.ship = state.data.ship;
    };
    this.starWarsShipContainer = new StarWarsShipContainer(updateListener);
  }

  ngOnChanges(newState) {
    const route = newState.route ? newState.route.currentValue : this.route;
    const relayProps = newState.relayProps ? newState.relayProps.currentValue : this.relayProps;

    if (route && relayProps) {
      this.starWarsShipContainer.update({ route: route, fragmentInput: {ship: relayProps} });
    }
  }
}

export { StarWarsShipContainer, StarWarsShip };
