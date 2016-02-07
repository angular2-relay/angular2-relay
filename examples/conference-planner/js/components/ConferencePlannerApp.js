import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View, NgZone } from 'angular2/core';
import { ConferenceItem, ConferenceItemContainer } from './ConferenceItem';
import { User, UserAccountContainer } from './User';

const ConferencePlannerAppContainer = Relay.createGenericContainer('ConferencePlannerApp', {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        user {
          ${UserAccountContainer.getFragment('user')}
          ${ConferenceItemContainer.getFragment('user')}
        },
        conferences {
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
  directives: [ConferenceItem, User],
  template: `
  <div class="conference-planner-app">
    <div class="conference-list">
      <conference-item
        *ngFor="#conference of relayData.root.conferences"
        [relayProps]="{ conference: conference, user: relayData.root.user }"
        [route]="route">
      </conference-item>
    </div>
    <user
      [relayProps]="{ user: relayData.root.user }"
      [route]="route">
    </user>
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
    this.relayData = { root: { user: {}, conferences: [] } };
  }


}

export { ConferencePlannerAppContainer, ConferencePlannerApp };
