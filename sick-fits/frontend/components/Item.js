import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Title from "./styles/Title";
import PriceTag from "./styles/PriceTag";
import ItemStyles from "./styles/ItemStyles";
import formatMoney from "../lib/formatMoney";
import DeleteItem from "./DeleteItem";
import AddToCart from "./AddToCart";

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    // it could be specified also as: but for the purpose of the course object is enough
    // item: PropTypes.shape({
    //   title: PropTypes.string.isRequired,
    //   price: PropTypes.number.isRequired
    // ....
    // })
  };

  render() {
    const { item } = this.props;
    return (
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title} />}
        <Title>
          <Link href={{ pathname: "/item", query: { id: item.id } }}>
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>
        <div className="buttonList">
          {/* TODO: invalidate if there is no "user logged" */}
          <Link href={{ pathname: "/update/item", query: { id: item.id } }}>
            <a>Edit </a>
          </Link>
          <AddToCart id={item.id} />
          {/* TODO: invalidate if there is no "user logged" */}
          <DeleteItem id={item.id}>Delete This Item</DeleteItem>
        </div>
      </ItemStyles>
    );
  }
}
