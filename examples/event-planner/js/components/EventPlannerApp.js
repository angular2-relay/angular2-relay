import Relay from 'generic-relay';
import { Component, Input, View, InputMetadata } from 'angular2/core';

import {connectRelay} from 'angular2-relay';

const EventPlannerAppContainer = Relay.createGenericContainer('EventPlannerApp', {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        user {
          firstName,
          lastName
        }
      }
    `,
  },
});

@Component({
  selector: 'event-planner-app'
})
@View({
  directives: [],
  template: `
  <div>
    <span>User: {{relayData.root.user.firstName}} {{relayData.root.user.lastName}}</span>
  </div>
    `
})
@connectRelay({container: EventPlannerAppContainer})
class EventPlannerApp {

  constructor() {
    this.initWithRelay();
    this.relayData = {root:{user:{}}};
  }
}

export { EventPlannerAppContainer, EventPlannerApp };
