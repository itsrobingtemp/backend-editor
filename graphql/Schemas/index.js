const User = require("../../models/User.js");
const { userValidation } = require("../../validation/userValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Graphql
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } =
  graphql;

// types
const UserType = require("./Types/UserType.js");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLString } },
      async resolve(parent, args) {
        const res = await User.find({ _id: args._id });
        return res;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    registerUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parents, args) {
        const { error } = userValidation({
          email: args.email,
          password: args.password,
        });

        if (error) return error;

        const emailExists = await User.findOne({ email: args.email });

        if (emailExists) return emailExists;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(args.password, salt);

        const user = new User({
          email: args.email,
          password: hashPassword,
        });

        const savedUser = await user.save();
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);

        savedUser.token = token;

        return savedUser;
      },
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parents, args) {
        const { error } = userValidation({
          email: args.email,
          password: args.password,
        });

        if (error) return;

        const user = await User.findOne({ email: args.email });

        if (!user) return;

        const validPassword = await bcrypt.compare(
          args.password,
          user.password
        );

        if (!validPassword) return;

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        user.token = token;

        return user;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
