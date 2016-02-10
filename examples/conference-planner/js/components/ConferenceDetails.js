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
    <div>{{ getDate(relayData.conference.date) | date }}</div>
    <div>Attending: {{ relayData.conference.attendance }}</div>
    <div>{{ relayData.conference.description }}</div>
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

  getDate(dateString) {
    return new Date(dateString);
  }
}

export { ConferenceDetailsContainer, ConferenceDetails };
