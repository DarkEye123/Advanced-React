import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import CartStyles from "./styles/CartStyles";
import CloseButton from "./styles/CloseButton";
import Supreme from "./styles/Supreme";
import SickButton from "./styles/SickButton";
import { CURRENT_USER_QUERY } from "./User";
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";

export const QUERY_CART_OPEN = gql`
  query {
    showCart @client
  }
`;

export const MUTATION_TOGGLE_CART_OPEN = gql`
  mutation {
    toggleShowCart @client
  }
`;

export default class Cart extends Component {
  render() {
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({ data: { me } }) => {
          if (!me) {
            return null;
          }
          console.log(me.cart);
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
                        <Supreme>{me.name}'s cart</Supreme>
                        <p>
                          You have {me.cart.length} item{me.cart.length > 1 && "s"} in your cart
                        </p>
                      </header>
                      <ul>
                        {me.cart.map(item => (
                          <CartItem key={item.id} cartItem={item} />
                        ))}
                      </ul>
                      <footer>
                        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                        <SickButton>Checkout</SickButton>
                      </footer>
                    </CartStyles>
                  )}
                </Query>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
