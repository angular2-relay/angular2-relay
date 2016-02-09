import Relay from 'generic-relay';
import { connectRelay } from 'angular2-relay';
import { View, Component, NgZone } from 'angular2/core';
import AttendConferenceMutation from '../mutations/AttendConferenceMutation';
import LeaveConferenceMutation from '../mutations/LeaveConferenceMutation';
import { ConferenceDetails, ConferenceDetailsContainer } from './ConferenceDetails';

const ConferenceContainer = Relay.createGenericContainer('Conference', {
  fragments: {
    conference: () => Relay.QL`
    fragment on Conference {
      id,
      name,
      userIsAttending,
      ${ConferenceDetailsContainer.getFragment('conference')}
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
  selector: 'conference',
})
@View({
  directives: [ConferenceDetails],
  template: `
  <h3>{{ relayData.conference.name }}</h3>

  <div class="conference-content">
    <conference-details
      [route]="route"
      [relayProps]="{ conference: relayData.conference }">
    </conference-details>

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
  container: ConferenceContainer,
})
class Conference {
  constructor(ngZone: NgZone) {
    this.initWithRelay(ngZone);
    this.relayData = {};
  }

  onAttendConference($event) {
    Relay.Store.commitUpdate(
      new AttendConferenceMutation({
        conference: this.relayData.conference,
        user: this.relayData.user,
      })
    );
    $event.stopPropagation();
  }

  onLeaveConference($event) {
    Relay.Store.commitUpdate(
      new LeaveConferenceMutation({
        conference: this.relayData.conference,
        user: this.relayData.user,
      })
    );
    $event.stopPropagation();
  }
}

export { Conference, ConferenceContainer };
