import Relay from 'generic-relay';
import { Component, Input, View, InputMetadata } from 'angular2/core';

import { StarWarsShip, StarWarsShipContainer } from './StarWarsShip';
import {connectRelay} from 'angular2-relay';

const StarWarsAppContainer = Relay.createGenericContainer('StarWarsApp', {
  fragments: {
    factions: () => Relay.QL`
      fragment on Faction @relay(plural: true) {
        name,
        ships(first: 10) {
          edges {
            node {
              name,
              ${StarWarsShipContainer.getFragment('ship')}
            }
          }
        }
      }
    `,
  },
});

@Component({
  selector: 'star-wars-app'
})
@View({
  directives: [StarWarsShip],
  template: `
    <ul>
      <li *ngFor="#faction of relayData.factions;">
        {{ faction.name }}
        <ul>
          <li *ngFor="#edge of faction.ships.edges">
            <star-wars-ship [relayProps]="{ship: edge.node}" [route]="route"></star-wars-ship>
          </li>
        </ul>
      </li>
    </ul>`
})
@connectRelay({container: StarWarsAppContainer})
class StarWarsApp {
  constructor() {
    this.initWithRelay();
  }
}

export { StarWarsAppContainer, StarWarsApp };
