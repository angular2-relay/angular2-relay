import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { View, Component, NgZone } from 'angular2/core';
import AttendConferenceMutation from '../mutations/AttendConferenceMutation';

const EventItemContainer = Relay.createGenericContainer('EventItem', {
  fragments: {
    event: () => Relay.QL`
    fragment on Event {
      id,
      name,
      date,
      description,
      going,
      userIsAttending
    }
    `,
    user: () => Relay.QL`
      fragment on User {
        ${AttendConferenceMutation.getFragment('user')}
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

    <button
      *ngIf="!relayData.event.userIsAttending"
      class="button-save"
      (click)="onAttendEvent($event, relayData.event.id)">
      Attend
    </button>

    <button
      *ngIf="relayData.event.userIsAttending"
      class="button-cancel">
      Leave
    </button>
  </div>
  `,
})
@connectRelay({
  container: EventItemContainer,
})
class EventItem {
  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.relayData = {};
  }

  onAttendEvent($event) {
    console.log(`Want to attend ${this.relayData.event.name},  ${this.relayData.event.id}`);
    Relay.Store.commitUpdate(
      new AttendConferenceMutation({ event: this.relayData.event, user: this.relayData.user })
    );
    $event.stopPropagation();
  }
}

export { EventItem, EventItemContainer };
