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
    return Relay.QL`mutation{ leaveEvent }`;
  }

  getVariables() {
    const { id } = this.props.event;
    return {
      eventId: id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LeaveEventPayload {
        event {
          going,
          userIsAttending
        },
        user {
          events
        },
        leftEventId
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { event: this.props.event.id },
    },
    {
      type: 'RANGE_DELETE',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'events',
      deletedIDFieldName: 'leftEventId',
      pathToConnection: ['user', 'events'],
    }];
  }

}
