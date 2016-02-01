import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';
import 'babel-polyfill';

import { provide, Component, View, NgZone } from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';


import Relay from 'generic-relay';
import StarWarsAppHomeRoute from './routes/StarWarsAppHomeRoute';

import { StarWarsApp, StarWarsAppContainer } from './components/StarWarsApp';

@Component({
  selector: 'app'
})
@View({
  directives: [StarWarsApp],
  template: `
    <h1>Star Wars App</h1>
    <star-wars-app [relayProps]="relayProps" [route]="route"></star-wars-app>
  `
})
class App {
  constructor(ngZone: NgZone) {
    const route = new StarWarsAppHomeRoute({
      factionNames: ['empire', 'rebels'],
    });

    const listener = ({data}) => {
      ngZone.run(() => {
        this.relayProps = data;
      });
    };

    const rootContainer = new Relay.GenericRootContainer(listener);
    rootContainer.update(StarWarsAppContainer, route);

    this.route = route;
  }

}

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
