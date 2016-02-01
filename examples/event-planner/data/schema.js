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
  getAvailableEvents,
  attendEvent
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

var eventMutation = mutationWithClientMutationId({
  name: 'AttendEvent',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    event: {
      type: eventType,
      resolve: (payload) => getEvent(payload.eventId)
    },
    user: {
      type: userType,
      resolve: () => getUser()
    },
  },
  mutateAndGetPayload: ({eventId}) => {
    attendEvent(eventId)
    return {
      eventId: eventId
    };
  },
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    attendEvent: eventMutation,
  }),
});

export var schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
