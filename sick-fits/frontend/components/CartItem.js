import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";
import formatMoney from "../lib/formatMoney";

export const MUTATION_REMOVE_CARTITEM = gql`
  mutation MUTATION_REMOVE_CARTITEM($id: ID!) {
    removeCartItem(id: $id) {
      id
    }
  }
`;

const CartItemStyled = styled.li`
  display: grid;
  padding: 1rem 0;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.lightGrey};
  img {
    margin-right: 10px;
  }
  p,
  h3 {
    margin: 0;
  }
  button {
    font-size: 3rem;
    border: none;
    background-color: white;
    color: black;
    margin-right: 10px;
    :hover {
      color: ${props => props.theme.red};
      cursor: pointer;
    }
  }
`;

function update(
  cache,
  {
    data: {
      removeCartItem: { id },
    },
  },
) {
  const data = cache.readQuery({ query: CURRENT_USER_QUERY });
  data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== id);
  cache.writeQuery({ query: CURRENT_USER_QUERY, data });
}

const CartItem = ({ cartItem }) => (
  <CartItemStyled>
    <img src={cartItem.item.image} width="100" alt={cartItem.item.title} />
    <div>
      <h3>{cartItem.item.title}</h3>
      <p>
        {formatMoney(cartItem.quantity * cartItem.item.price)} - {cartItem.quantity} ×{" "}
        {formatMoney(cartItem.item.price)} each
      </p>
    </div>
    <Mutation
      mutation={MUTATION_REMOVE_CARTITEM}
      variables={{ id: cartItem.id }}
      update={update}
      optimisticResponse={{ removeCartItem: { __typename: "CartItem", id: cartItem.id } }}
    >
      {(removeCartItem, _) => <button onClick={removeCartItem}>×</button>}
    </Mutation>
  </CartItemStyled>
);

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
};

export default CartItem;
