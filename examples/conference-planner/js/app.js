require('./app.less');
import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';
import 'babel-polyfill';

import { provide, Component, View, NgZone } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from 'angular2/router';


import Relay from 'generic-relay';
import ConferencePlannerAppHomeRoute from './routes/ConferencePlannerAppHomeRoute';

import {
  ConferencePlannerApp,
  ConferencePlannerAppContainer,
} from './components/ConferencePlannerApp';

@Component({
  selector: 'app',
})
@View({
  directives: [ConferencePlannerApp],
  template: `
  <div>
    <h1>Conference Planner</h1>
    <conference-planner-app [relayProps]="relayProps" [route]="route"></conference-planner-app>
  </div>
  `,
})
class App {
  constructor(ngZone: NgZone) {
    const route = new ConferencePlannerAppHomeRoute();

    const listener = ({ data }) => {
      ngZone.run(() => {
        this.relayProps = data;
      });
    };

    const rootContainer = new Relay.GenericRootContainer(listener);
    rootContainer.update(ConferencePlannerAppContainer, route);

    this.route = route;
  }

}

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
]);
