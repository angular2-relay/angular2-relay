import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View } from 'angular2/core';
import { EventItem, EventItemContainer } from './EventItem';

const EventPlannerAppContainer = Relay.createGenericContainer('EventPlannerApp', {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        user {
          firstName,
          lastName
        },
        availableEvents {
          ${EventItemContainer.getFragment('event')}
        }
      }
    `,
  },
});

@Component({
  selector: 'event-planner-app',
})
@View({
  directives: [EventItem],
  template: `
  <div class="event-planner-app">
    <div class="event-list">
      <event-item
        *ngFor="#event of relayData.root.availableEvents"
        [relayProps]="{event: event}"
        [route]="route">
      </event-item>
    </div>
    <div class="user-account">
      <h2>Hi {{relayData.root.user.firstName}} {{relayData.root.user.lastName}}</h2>
    </div>
  </div>
    `,
})
@connectRelay({
  container: EventPlannerAppContainer,
})
class EventPlannerApp {

  constructor() {
    this.initWithRelay();
    this.relayData = { root: { user: {}, availableEvents: [] } };
  }

}

export { EventPlannerAppContainer, EventPlannerApp };
