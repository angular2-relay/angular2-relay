import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { View, Component } from 'angular2/core';
import AttendConferenceMutation from '../mutations/AttendConferenceMutation';
import LeaveConferenceMutation from '../mutations/LeaveConferenceMutation';

const ConferenceItemContainer = Relay.createGenericContainer('ConferenceItem', {
  fragments: {
    conference: () => Relay.QL`
    fragment on Conference {
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
        ${LeaveConferenceMutation.getFragment('user')}
      }
     `,
  },
});

@Component({
  selector: 'conference-item',
})
@View({
  directives: [],
  template: `
  <div>
    <h3>{{ relayData.conference.name }}</h3>
    <div>{{ relayData.conference.date }}</div>
    <div>{{ relayData.conference.description }}</div>
    <div>Attending: {{ relayData.conference.going }}</div>

    <button
      *ngIf="!relayData.conference.userIsAttending"
      class="button-save"
      (click)="onAttendConference($event, relayData.conference.id)">
      Attend
    </button>

    <button
      *ngIf="relayData.conference.userIsAttending"
      class="button-cancel"
      (click)="onLeaveConference($event, relayData.conference.id)">
      Leave
    </button>
  </div>
  `,
})
@connectRelay({
  container: ConferenceItemContainer,
})
class ConferenceItem {
  constructor() {
    this.initWithRelay();
  }

  onAttendConference($event) {
    Relay.Store.commitUpdate(
      new AttendConferenceMutation({ conference: this.relayData.conference,
        user: this.relayData.user })
    );
    $event.stopPropagation();
  }

  onLeaveConference($event) {
    Relay.Store.commitUpdate(
      new LeaveConferenceMutation({ conference: this.relayData.conference,
        user: this.relayData.user })
    );
    $event.stopPropagation();
  }
}

export { ConferenceItem, ConferenceItemContainer };
