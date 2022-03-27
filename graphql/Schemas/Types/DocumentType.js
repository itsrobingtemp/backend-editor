// Graphql
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = graphql;

const DocumentType = new GraphQLObjectType({
  name: "Document",
  fields: {
    _id: { type: GraphQLString },
    text: { type: GraphQLObject },
    name: { type: GraphQLString },
    owner: { type: GraphQLString },
    sharedWith: { type: GraphQLString },
    isCode: { type: GraphQLBoolean },
  },
});

module.exports = DocumentType;
