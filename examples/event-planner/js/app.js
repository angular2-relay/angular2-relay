require('./app.less');
import 'zone.js/lib/browser/zone-microtask';
import 'reflect-metadata';
import 'babel-polyfill';

import { provide, Component, View, NgZone } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from 'angular2/router';


import Relay from 'generic-relay';
import EventPlannerAppHomeRoute from './routes/EventPlannerAppHomeRoute';

import { EventPlannerApp, EventPlannerAppContainer } from './components/EventPlannerApp';

@Component({
  selector: 'app',
})
@View({
  directives: [EventPlannerApp],
  template: `
  <div>
    <h1>Event Planner</h1>
    <event-planner-app [relayProps]="relayProps" [route]="route"></event-planner-app>
  </div>
  `,
})
class App {
  constructor(ngZone: NgZone) {
    const route = new EventPlannerAppHomeRoute();

    const listener = ({ data }) => {
      ngZone.run(() => {
        this.relayProps = data;
      });
    };

    const rootContainer = new Relay.GenericRootContainer(listener);
    rootContainer.update(EventPlannerAppContainer, route);

    this.route = route;
  }

}

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
]);
