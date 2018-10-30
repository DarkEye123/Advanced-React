import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import Router from "next/router";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

export default class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, value, type } = e.target;
    // console.log({ name, value, type });
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  async updateItem(e, updateItemMutation) {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) {
            return <p>Loading ...</p>;
          }
          if (!data.item) {
            return (
              <Error
                error={{ message: `No item with id ${this.props.id} found` }}
              />
            );
          }
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {/* by default its child looks like this */}
              {/* {(mutationFunction, payload)} */}
              {/* name: updateItem is just name, it is not needed to have that form */}
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        name="title"
                        id="title"
                        placeholder="Title" // defaultValue  maps its changes to the component state by default
                        defaultValue={data.item.title}
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
                        defaultValue={data.item.price}
                        required
                        onChange={this.handleChange}
                        type="number"
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      {/* react can handle value in text area, by default there is no such prop */}
                      <textarea
                        name="description"
                        id="description"
                        placeholder="Please describe the item"
                        defaultValue={data.item.description}
                        required
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">
                      Sav
                      {loading ? "ing" : "e"} Changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
