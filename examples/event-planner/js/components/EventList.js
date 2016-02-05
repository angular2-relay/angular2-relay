import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { Component, View } from 'angular2/core';

const EventListContainer = Relay.createGenericContainer('EventList', {
  fragments: {
    availableEvents: () => Relay.QL`
      fragment on Root {
        availableEvents {
          id,
          date,
          description
        }
      }
    `,
  },
});

@Component({
  selector: 'event-list'
})
@View({
  directives: [],
  template: `
  {{availableEvents}}
  <div *ngFor="#event of relayData.availableEvents;"> {{ event.description }}</div>
  `
})
@connectRelay({
  container: EventListContainer
})
class EventList {

  constructor() {
    this.initWithRelay();
    this.relayData = {};
  }

}

export { EventList, EventListContainer };
