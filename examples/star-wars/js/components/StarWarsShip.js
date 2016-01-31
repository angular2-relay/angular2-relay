import Relay from 'generic-relay';
import { Component, Input } from 'angular2/core';
import {connectRelay} from 'angular2-relay';

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
  template: `<div>{{ relayData.ship.name }}</div>`
})
@connectRelay({container: StarWarsShipContainer})
class StarWarsShip {

  constructor() {
    this.initWithRelay();
  }

}

export { StarWarsShipContainer, StarWarsShip };
