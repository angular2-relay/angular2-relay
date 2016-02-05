import Relay from 'generic-relay';

export default class AttendConferenceMutation extends Relay.Mutation {
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
          going
        }
      }
    `;
  }

  getConfigs() {
    return [{

    }];
  }

  getOptimisticResponse() {
    return {

    };
  }
}
