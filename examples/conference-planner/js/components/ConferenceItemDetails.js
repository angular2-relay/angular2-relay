import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View, NgZone } from 'angular2/core';

const ConferenceItemDetailsContainer =
  Relay.createGenericContainer('ConferenceItemDetails', {
    fragments: {
      conference: () => Relay.QL`
        fragment on Conference {
          date,
          description,
          going,
        }
       `,
    },
  });

@Component({
  selector: 'conference-item-details',
})
@View({
  directives: [],
  template: `
    <div>{{ relayData.conference.date }}</div>
    <div>{{ relayData.conference.description }}</div>
    <div>Attending: {{ relayData.conference.going }}</div>
  `,
})
@connectRelay({
  container: ConferenceItemDetailsContainer,
})
class ConferenceItemDetails {
  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.relayData = { conference: {} };
  }
}

export { ConferenceItemDetailsContainer, ConferenceItemDetails };
