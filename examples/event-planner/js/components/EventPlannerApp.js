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
  <div>
    <span>User: {{relayData.root.user.firstName}} {{relayData.root.user.lastName}}</span>
    <div *ngFor="#event of relayData.root.availableEvents">
      <event-item [relayProps]="{event: event}" [route]="route"></event-item>
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
