import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import CartStyles from "./styles/CartStyles";
import CloseButton from "./styles/CloseButton";
import Supreme from "./styles/Supreme";
import SickButton from "./styles/SickButton";

export const QUERY_CART_OPEN = gql`
  query QUERY_CART_OPEN {
    showCart @client
  }
`;

const MUTATION_TOGGLE_CART_OPEN = gql`
  mutation MUTATION_TOGGLE_CART_OPEN {
    toggleShowCart @client
  }
`;

export default class Cart extends Component {
  render() {
    return (
      <Mutation mutation={MUTATION_TOGGLE_CART_OPEN}>
        {(toggleShowCart, _) => (
          <Query query={QUERY_CART_OPEN}>
            {({ data }) => (
              <CartStyles open={data.showCart}>
                <header>
                  <CloseButton title="close" onClick={toggleShowCart}>
                    ×
                  </CloseButton>
                  <Supreme>Your cart</Supreme>
                  <p>You have __ items in your cart</p>
                </header>
                <footer>
                  <p>10.10$</p>
                  <SickButton>Checkout</SickButton>
                </footer>
              </CartStyles>
            )}
          </Query>
        )}
      </Mutation>
    );
  }
}
