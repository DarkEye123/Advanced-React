import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import styled from "styled-components";
import Head from "next/head";

const ITEM_QUERY = gql`
  query ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      image
      largeImage
      price
    }
  }
`;

const StyledItem = styled.div`
  display: grid;
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  .details {
    font-size: 2rem;
    margin: 3rem;
  }
`;

export default class SingleItem extends Component {
  render() {
    return (
      <Query query={ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, error, loading }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }
          if (loading) {
            return <p>loading</p>;
          }
          if (!data.item) {
            return <p>No data found for {this.props.id}</p>;
          }
          const item = data.item;
          return (
            <StyledItem>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </StyledItem>
          );
        }}
      </Query>
    );
  }
}
