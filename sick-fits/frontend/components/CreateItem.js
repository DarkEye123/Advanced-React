import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import Router from "next/router";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`;

export default class CreateItem extends Component {
  state = {
    title: "Item v1",
    description: "Testing Item from CreateItem.js",
    price: 1589,
    image: "item.png",
    largeImage: "bigItem.png"
  };

  handleChange = e => {
    const { name, value, type } = e.target;
    // console.log({ name, value, type });
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {/* by default its child looks like this */}
        {/* {(mutationFunction, payload)} */}
        {/* name: createItem is just name, it is not needed to have that form */}
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              //stop the form from submitting
              e.preventDefault();
              //calling the mutation
              const res = await createItem();
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input
                  name="title"
                  id="title"
                  placeholder="Title"
                  value={this.state.title}
                  required
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  name="price"
                  id="price"
                  placeholder="Price"
                  value={this.state.price}
                  required
                  onChange={this.handleChange}
                  type="number"
                />
              </label>
              <label htmlFor="description">
                Title
                {/* react can handle value in text area, by default there is no such prop */}
                <textarea
                  name="description"
                  id="description"
                  placeholder="Please describe the item"
                  value={this.state.description}
                  required
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}
