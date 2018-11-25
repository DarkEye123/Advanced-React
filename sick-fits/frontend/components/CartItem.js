import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";

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
`;

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
  </CartItemStyled>
);

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
};

export default CartItem;
