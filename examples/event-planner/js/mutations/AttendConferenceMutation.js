import Relay from 'generic-relay';

export default class AttendConferenceMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{ attendEvent }`;
  }

  getVariables() {
    const { id } = this.props.event;
    return {
      eventId: id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AttendEventPayload {
        event {
          going,
          userIsAttending
        },
        user {
          events
        },
        eventEdge{
          node
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { event: this.props.event.id },
    }, {
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'events',
      edgeName: 'eventEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }

  getOptimisticResponse() {
    return {

    };
  }
}
