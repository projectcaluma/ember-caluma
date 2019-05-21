import { GraphQLDateTime } from "graphql-iso-date";

export default {
  DateTime: GraphQLDateTime,
  // generic scalar serializes from a string to an object but deserializes as
  // object for some reason ¯\_(ツ)_/¯. But hey, it works!
  GenericScalar: {
    serialize(str) {
      return typeof str === "string" ? JSON.parse(str) : str;
    },
    deserialize(obj) {
      return obj;
    }
  }
};
