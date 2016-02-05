import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection
} from 'graphql-relay';

import {
  getUser,
  getEvent,
  getAvailableEvents,
  attendEvent,
} from './database';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser();
    } else if (type === 'Event') {
      return getEvent(id);
    }
    return null;
  },
  (obj) => obj.firstName ? userType : eventType,
);

const eventType = new GraphQLObjectType({
  name: 'Event',
  description: 'Some cool event',
  fields: () => ({
    id: globalIdField('Event'),
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    date: {
      type: GraphQLString,
    },
    going: {
      type: GraphQLInt,
    },
    userIsAttending: {
      type: GraphQLBoolean,
    },
  }),
  interfaces: [nodeInterface],
});

const { connectionType: eventConnection, edgeType: eventEdgeType } =
  connectionDefinitions({ name: 'Event', nodeType: eventType });

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    events: {
      type: eventConnection,
      args: connectionArgs,
      resolve: (user, args) => connectionFromArray(
              user.events.map((id) => getEvent(id)),
              args),
    },
  }),
  interfaces: [nodeInterface],
});


const rootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    user: {
      type: userType,
      resolve: () => getUser(),
    },
    availableEvents: {
      type: new GraphQLList(eventType),
      resolve: () => getAvailableEvents(),
    },
  }),
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

const eventMutation = mutationWithClientMutationId({
  name: 'AttendEvent',
  inputFields: {
    eventId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    event: {
      type: eventType,
      resolve: ({ eventId }) => getEvent(fromGlobalId(eventId).id),
    },
    user: {
      type: userType,
      resolve: () => getUser(),
    },
    eventEdge: {
      type: eventEdgeType,
      resolve: ({ eventId }) => {
        const event = getEvent(fromGlobalId(eventId).id);
        const eventsAttenendByUser = getUser().events.map((id) => getEvent(id));
        return {
          cursor: cursorForObjectInConnection(eventsAttenendByUser, event),
          node: event,
        };
      },
    },
  },
  mutateAndGetPayload: ({ eventId }) => {
    attendEvent(fromGlobalId(eventId).id);
    return {
      eventId,
    };
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    attendEvent: eventMutation,
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
