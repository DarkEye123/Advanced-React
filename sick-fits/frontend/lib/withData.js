import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
import { endpoint } from "../config";
import { QUERY_CART_OPEN } from "../components/Cart";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,
    request: operation => {
      operation.setContext({ fetchOptions: { credentials: "include" }, headers });
    },
    clientState: {
      resolvers: {
        Mutation: {
          toggleShowCart(obj, args, { cache }, info) {
            const { showCart } = cache.readQuery({
              query: QUERY_CART_OPEN,
            });
            // IMPORTANT --  __typename: "Boolean" Boolean needs to be in "" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const data = { data: { __typename: "Boolean", showCart: !showCart } };
            cache.writeData(data);
            return data;
          },
        },
      },
      defaults: { showCart: true },
    },
  });
}

export default withApollo(createClient);
