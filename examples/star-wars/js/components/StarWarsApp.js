import Relay from 'generic-relay';
import { Component, Input, View, InputMetadata } from 'angular2/core';

import { StarWarsShip, StarWarsShipContainer } from './StarWarsShip';

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
@myannotation()
class StarWarsApp {

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


function myannotation() {
  // Add a property on target
  return (target) => {
    Reflect.defineMetadata('propMetadata', {
      relayProps: [new InputMetadata()],
      route: [new InputMetadata()]
    }, target);
    return target;
  };
}

console.log(StarWarsApp);
