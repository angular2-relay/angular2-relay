import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { View, Component } from 'angular2/core';

const EventItemContainer = Relay.createGenericContainer('EventItem', {
  fragments: {
    event: () => Relay.QL`
    fragment on Event {
      id,
      name,
      date,
      description,
      going
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
  <div>
    <h3>{{ relayData.event.name }}</h3>
    <div>{{ relayData.event.date }}</div>
    <div>{{ relayData.event.description }}</div>
    <div>Attending: {{ relayData.event.going }}</div>
    <button class="button-save" (click)="onAttendEvent($event, relayData.event.id)">Attend</button>
  </div>
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

  onAttendEvent($event) {
    console.log(`Want to attend ${this.relayData.event.name},  ${this.relayData.event.id}`);
    $event.stopPropagation();
  }
}

export { EventItem, EventItemContainer };
