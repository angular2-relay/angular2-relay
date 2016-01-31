import Relay from 'generic-relay';

export default class extends Relay.Route {
  static queries = {
    factions: () => Relay.QL`query { factions(names: $factionNames) }`,
  };
  static routeName = 'StarWarsAppHomeRoute';
}
