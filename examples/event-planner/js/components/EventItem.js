import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { View, Component } from 'angular2/core';

const EventItemContainer = Relay.createGenericContainer('EventItem', {
  fragments: {
    event: () => Relay.QL`
    fragment on Event {
      date,
      description
    }
    `,
  },
});

@Component({
  selector: 'event-item',
})
@View({
  directives: [],
  template: `
  <div>{{relayData.event.description}} {{relayData.event.date}}</div>
  `,
})
@connectRelay({
  container: EventItemContainer,
})
class EventItem {

  constructor() {
    this.initWithRelay();
    this.relayData = {};
  }

}

export { EventItem, EventItemContainer };
