import { GraphQLDateTime } from "graphql-iso-date";

export default {
  DateTime: GraphQLDateTime,
  // generic scalar serializes from a string to an object but deserializes as
  // object because of backend limitations.
  GenericScalar: {
    serialize(str) {
      return typeof str === "string" ? JSON.parse(str) : str;
    },
    deserialize(obj) {
      return obj;
    }
  }
};
