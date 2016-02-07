import Relay from 'generic-relay';

export default class extends Relay.Route {
  static queries = {
    root: () => Relay.QL`query { root }`,
  };
  static routeName = 'ConferencePlannerAppHomeRoute';
}
