import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View, NgZone } from 'angular2/core';

const UserAccountContainer = Relay.createGenericContainer('User', {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        firstName,
        lastName,
        attendingConferences(first: 10) {
          edges {
            node {
              name,
              attendance
            }
          }
        }
      }
     `,
  },
});

@Component({
  selector: 'user',
})
@View({
  directives: [],
  template: `
    <div class="user">
      <h2>Hi {{ getUser().firstName }} {{ getUser().lastName }}</h2>
      Conferences you attend:
      <ul>
        <li *ngFor="#edge of getUser().attendingConferences.edges">
          <strong>{{ edge.node.name }}</strong> with {{ edge.node.attendance - 1}} others
        </li>
      </ul>
    </div>
  `,
})
@connectRelay({
  container: UserAccountContainer,
})
class User {
  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.relayData = { user: {} };
  }
  getUser() {
    return this.relayData.user || { attendingConferences: { } };
  }
}

export { UserAccountContainer, User };
