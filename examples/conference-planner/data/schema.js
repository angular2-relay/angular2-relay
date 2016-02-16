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
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  getUser,
  getConference,
  getAvailableConferences,
  attendConference,
  leaveConference,
} from './database';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser();
    } else if (type === 'Conference') {
      return getConference(id);
    }
    return null;
  },
  (obj) => obj.firstName ? userType : conferenceType,
);

const conferenceType = new GraphQLObjectType({
  name: 'Conference',
  description: 'Some cool conference',
  fields: () => ({
    id: globalIdField('Conference'),
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    date: {
      type: GraphQLString,
    },
    attendance: {
      type: GraphQLInt,
    },
    location: {
      type: GraphQLString,
    },
    userIsAttending: {
      type: GraphQLBoolean,
    },
  }),
  interfaces: [nodeInterface],
});

const { connectionType: conferenceConnection, edgeType: conferenceEdgeType } =
  connectionDefinitions({ name: 'Conference', nodeType: conferenceType });

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
    dob: {
      type: GraphQLString,
    },
    attendingConferences: {
      type: conferenceConnection,
      args: connectionArgs,
      resolve: (user, args) => connectionFromArray(
              user.attendingConferences.map((id) => getConference(id)),
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
    conferences: {
      type: new GraphQLList(conferenceType),
      resolve: () => getAvailableConferences(),
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

const attendMutation = mutationWithClientMutationId({
  name: 'AttendConference',
  inputFields: {
    conferenceId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    conference: {
      type: conferenceType,
      resolve: ({ conferenceId }) => getConference(fromGlobalId(conferenceId).id),
    },
    user: {
      type: userType,
      resolve: () => getUser(),
    },
    conferenceEdge: {
      type: conferenceEdgeType,
      resolve: ({ conferenceId }) => {
        const conference = getConference(fromGlobalId(conferenceId).id);
        const conferencesAttenendByUser =
          getUser().attendingConferences.map((id) => getConference(id));
        return {
          cursor: cursorForObjectInConnection(conferencesAttenendByUser, conference),
          node: conference,
        };
      },
    },
  },
  mutateAndGetPayload: ({ conferenceId }) => {
    attendConference(fromGlobalId(conferenceId).id);
    return {
      conferenceId,
    };
  },
});


const leaveMutation = mutationWithClientMutationId({
  name: 'LeaveConference',
  inputFields: {
    conferenceId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    conference: {
      type: conferenceType,
      resolve: ({ conferenceId }) => getConference(fromGlobalId(conferenceId).id),
    },
    leftConferenceId: {
      type: GraphQLID,
      resolve: ({ conferenceId }) => conferenceId,
    },
    user: {
      type: userType,
      resolve: () => getUser(),
    },
  },
  mutateAndGetPayload: ({ conferenceId }) => {
    leaveConference(fromGlobalId(conferenceId).id);
    return {
      conferenceId,
    };
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    attendConference: attendMutation,
    leaveConference: leaveMutation,
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
