import Relay from 'generic-relay';
import { Component, Input, View } from 'angular2/core';

import { StarWarsShip, StarWarsShipContainer } from './Ng2StarWarsShip';

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
            <star-wars-ship [relayProps]="edge.node" [route]="route"></star-wars-ship>
          </li>
        </ul>
      </li>
    </ul>`
})
class StarWarsApp {
  @Input() relayProps = '';
  @Input() route = '';

  constructor() {
    this.relayData = {};
    const updateListener = (state) => {
      this.relayData = state.data;
    };
    this.starWarsAppContainer = new StarWarsAppContainer(updateListener);
  }

  ngOnChanges(newState) {

    const route = newState.route ? newState.route.currentValue : this.route;
    const relayProps = newState.relayProps ? newState.relayProps.currentValue : this.relayProps;

    if (route && relayProps) {
      this.starWarsAppContainer.update({route: route, fragmentInput: relayProps});
    }
  }

}

export { StarWarsAppContainer, StarWarsApp };
