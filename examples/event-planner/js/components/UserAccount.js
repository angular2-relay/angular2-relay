import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View, NgZone } from 'angular2/core';

const UserAccountContainer = Relay.createGenericContainer('UserAccount', {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        firstName,
        lastName,
        events(first: 10) {
          edges {
            node {
              name,
              going
            }
          }
        }
      }
     `,
  },
});

@Component({
  selector: 'user-account',
})
@View({
  directives: [],
  template: `
    <div class="user-account">
      <h2>Hi {{ getUser().firstName }} {{ getUser().lastName }}</h2>
      <div>
        Events you attend:
        <div *ngFor="#edge of getUser().events.edges">
          <strong>{{ edge.node.name }}</strong> with {{ edge.node.going}} others
        </div>
      </div>
    </div>
  `,
})
@connectRelay({
  container: UserAccountContainer,
})
class UserAccount {
  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.relayData = { user: {} };
  }
  getUser() {
    return this.relayData.user || { events: { } };
  }
}

export { UserAccountContainer, UserAccount };
