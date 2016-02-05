import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View } from 'angular2/core';

const UserAccountContainer = Relay.createGenericContainer('UserAccount', {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        firstName,
        lastName
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
    </div>
  `,
})
@connectRelay({
  container: UserAccountContainer,
})
class UserAccount {
  constructor() {
    this.initWithRelay();
    this.relayData = { user: {} };
  }
  getUser() {
    return this.relayData.user || {};
  }
}

export { UserAccountContainer, UserAccount };
