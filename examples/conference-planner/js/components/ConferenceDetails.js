import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View, NgZone } from 'angular2/core';

const ConferenceDetailsContainer =
  Relay.createGenericContainer('ConferenceDetails', {
    fragments: {
      conference: () => Relay.QL`
        fragment on Conference {
          date,
          description,
          attendance,
        }
       `,
    },
  });

@Component({
  selector: 'conference-details',
})
@View({
  directives: [],
  template: `
    <div>{{ relayData.conference.date }}</div>
    <div>{{ relayData.conference.description }}</div>
    <div>Attending: {{ relayData.conference.attendance }}</div>
  `,
})
@connectRelay({
  container: ConferenceDetailsContainer,
})
class ConferenceDetails {
  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.relayData = { conference: {} };
  }
}

export { ConferenceDetailsContainer, ConferenceDetails };
