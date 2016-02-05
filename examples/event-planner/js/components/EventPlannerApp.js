import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View } from 'angular2/core';
import { EventList, EventListContainer } from './EventList';

const EventPlannerAppContainer = Relay.createGenericContainer('EventPlannerApp', {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        user {
          firstName,
          lastName
        },
        ${EventListContainer.getFragment('availableEvents')}
      }
    `,
  },
});

@Component({
  selector: 'event-planner-app'
})
@View({
  directives: [EventList],
  template: `
  <div>
    <span>User: {{relayData.root.user.firstName}} {{relayData.root.user.lastName}}</span>
    <event-list [relayProps]="relayProps" [route]="route"></event-list>
  </div>
    `
})
@connectRelay({
  container: EventPlannerAppContainer
})
class EventPlannerApp {

  constructor() {
    this.initWithRelay();
    this.relayData = { root: { user: {} } };
  }

  ngOnChanges(newState) {
    console.log(newState);
  }

}

export { EventPlannerAppContainer, EventPlannerApp };
