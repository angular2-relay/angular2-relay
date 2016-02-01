import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  getUser,
  getEvent
} from './database';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser();
    } else if (type === 'Event') {
      return getEvent(id);
    } else {
      return null;
    }
  },
  (obj) => {
    return obj.firstName ? userType : eventType;
  }
);

// var shipType = new GraphQLObjectType({
//   name: 'Ship',
//   description: 'A ship in the Star Wars saga',
//   fields: () => ({
//     id: globalIdField('Ship'),
//     name: {
//       type: GraphQLString,
//       description: 'The name of the ship.',
//     },
//   }),
//   interfaces: [nodeInterface],
// });
//
// /**
//  * We define a connection between a faction and its ships.
//  *
//  * connectionType implements the following type system shorthand:
//  *   type ShipConnection {
//  *     edges: [ShipEdge]
//  *     pageInfo: PageInfo!
//  *   }
//  *
//  * connectionType has an edges field - a list of edgeTypes that implement the
//  * following type system shorthand:
//  *   type ShipEdge {
//  *     cursor: String!
//  *     node: Ship
//  *   }
//  */
// var {connectionType: shipConnection} =
//   connectionDefinitions({name: 'Ship', nodeType: shipType});
//
// var factionType = new GraphQLObjectType({
//   name: 'Faction',
//   description: 'A faction in the Star Wars saga',
//   fields: () => ({
//     id: globalIdField('Faction'),
//     name: {
//       type: GraphQLString,
//       description: 'The name of the faction.',
//     },
//     ships: {
//       type: shipConnection,
//       description: 'The ships used by the faction.',
//       args: connectionArgs,
//       resolve: (faction, args) => connectionFromArray(
//         faction.ships.map((id) => getShip(id)),
//         args
//       ),
//     },
//   }),
//   interfaces: [nodeInterface],
// });

const eventType = new GraphQLObjectType({
  name: 'Event',
  description: 'Some cool event',
  fields: () => ({
     id: globalIdField('Event')
  }),
  interfaces: [nodeInterface]
});

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'The user of our system',
  fields: () => ({
    id: globalIdField('User'),
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    }
  }),
  interfaces: [nodeInterface]
});



const rootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    user: {
      type: userType,
      resolve: () => getUser()
    },
    availableEvents: {
      type: new GraphQLList(eventType)
    }
  })
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    root: {
      type: rootType,
      resolve: () => ({}),
    },
    node: nodeField,
  }),
});

/**
 * This will return a GraphQLFieldConfig for our ship mutation.
 *
 * It creates these two types implicitly:
 *   input IntroduceShipInput {
 *     clientMutationId: string!
 *     shipName: string!
 *     factionId: ID!
 *   }
 *
 *   input IntroduceShipPayload {
 *     clientMutationId: string!
 *     ship: Ship
 *     faction: Faction
 *   }
 */
// var shipMutation = mutationWithClientMutationId({
//   name: 'IntroduceShip',
//   inputFields: {
//     shipName: {
//       type: new GraphQLNonNull(GraphQLString),
//     },
//     factionId: {
//       type: new GraphQLNonNull(GraphQLID),
//     },
//   },
//   outputFields: {
//     ship: {
//       type: shipType,
//       resolve: (payload) => getShip(payload.shipId),
//     },
//     faction: {
//       type: factionType,
//       resolve: (payload) => getFaction(payload.factionId),
//     },
//   },
//   mutateAndGetPayload: ({shipName, factionId}) => {
//     var newShip = createShip(shipName, factionId);
//     return {
//       shipId: newShip.id,
//       factionId: factionId,
//     };
//   },
// });

// /**
//  * This is the type that will be the root of our mutations,
//  * and the entry point into performing writes in our schema.
//  *
//  * This implements the following type system shorthand:
//  *   type Mutation {
//  *     introduceShip(input: IntroduceShipInput!): IntroduceShipPayload
//  *   }
//  */
// var mutationType = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: () => ({
//     introduceShip: shipMutation,
//   }),
// });

export var schema = new GraphQLSchema({
  query: queryType
  // mutation: mutationType,
});
