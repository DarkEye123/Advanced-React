import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const MUTATION_ADD_TO_CART = gql`
  mutation MUTATION_ADD_TO_CART($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

export default class AddToCart extends Component {
  render() {
    const { id } = this.props;
    return (
      <Mutation mutation={MUTATION_ADD_TO_CART} variables={{ id }} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(addToCart, { loading, error }) => (
          <button onClick={addToCart} disabled={loading}>
            Add{loading && "ing"} To Cart 🛒
          </button>
        )}
      </Mutation>
    );
  }
}
