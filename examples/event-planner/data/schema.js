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
  getEvent,
  getAvailableEvents
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

const eventType = new GraphQLObjectType({
  name: 'Event',
  description: 'Some cool event',
  fields: () => ({
     id: globalIdField('Event'),
     name: {
       type: GraphQLString
     },
     description: {
       type: GraphQLString
     },
     date: {
       type: GraphQLString
     }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: eventConnection} =
  connectionDefinitions({name: 'Event', nodeType: eventType});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    events : {
      type: eventConnection,
      args: connectionArgs,
      resolve: (user, args) => connectionFromArray(
              user.events.map((id) => getEvent(id)),
              args),
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
      type: new GraphQLList(eventType),
      resolve: () => getAvailableEvents()
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
