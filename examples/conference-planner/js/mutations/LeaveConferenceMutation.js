import Relay from 'generic-relay';

export default class LeaveConferenceMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{ leaveConference }`;
  }

  getVariables() {
    const { id } = this.props.conference;
    return {
      conferenceId: id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LeaveConferencePayload {
        conference {
          attendance,
          userIsAttending
        },
        user {
          attendingConferences
        },
        leftConferenceId
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { conference: this.props.conference.id },
    },
    {
      type: 'RANGE_DELETE',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'attendingConferences',
      deletedIDFieldName: 'leftConferenceId',
      pathToConnection: ['user', 'attendingConferences'],
    }];
  }

}
