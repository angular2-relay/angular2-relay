import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View, NgZone, Injector, Inject } from 'angular2/core';
import { EventItem, EventItemContainer } from './EventItem';
import { UserAccount, UserAccountContainer } from './UserAccount';

const EventPlannerAppContainer = Relay.createGenericContainer('EventPlannerApp', {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        user {
          ${UserAccountContainer.getFragment('user')}
          ${EventItemContainer.getFragment('user')}
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
  directives: [EventItem, UserAccount],
  template: `
  <div class="event-planner-app">
    <div class="event-list">
      <event-item
        *ngFor="#event of relayData.root.availableEvents"
        [relayProps]="{ event: event, user: relayData.root.user }"
        [route]="route">
      </event-item>
    </div>
    <user-account
      [relayProps]="{ user: relayData.root.user }"
      [route]="route">
    </user-account>
  </div>
    `,
})
@connectRelay({
  container: EventPlannerAppContainer,
})
class EventPlannerApp {

  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.ngZone = ngZone;
    this.relayData = { root: { user: {}, availableEvents: [] } };
  }


}

export { EventPlannerAppContainer, EventPlannerApp };
