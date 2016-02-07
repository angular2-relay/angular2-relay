import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View, NgZone } from 'angular2/core';
import { ConferenceItem, ConferenceItemContainer } from './ConferenceItem';
import { UserAccount, UserAccountContainer } from './UserAccount';

const ConferencePlannerAppContainer = Relay.createGenericContainer('ConferencePlannerApp', {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        user {
          ${UserAccountContainer.getFragment('user')}
          ${ConferenceItemContainer.getFragment('user')}
        },
        availableConferences {
          ${ConferenceItemContainer.getFragment('conference')}
        }
      }
    `,
  },
});

@Component({
  selector: 'conference-planner-app',
})
@View({
  directives: [ConferenceItem, UserAccount],
  template: `
  <div class="conference-planner-app">
    <div class="conference-list">
      <conference-item
        *ngFor="#conference of relayData.root.availableConferences"
        [relayProps]="{ conference: conference, user: relayData.root.user }"
        [route]="route">
      </conference-item>
    </div>
    <user-account
      [relayProps]="{ user: relayData.root.user }"
      [route]="route">
    </user-account>
  </div>
    `,
})
@connectRelay({
  container: ConferencePlannerAppContainer,
})
class ConferencePlannerApp {

  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.ngZone = ngZone;
    this.relayData = { root: { user: {}, availableConferences: [] } };
  }


}

export { ConferencePlannerAppContainer, ConferencePlannerApp };
