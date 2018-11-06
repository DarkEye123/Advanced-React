import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "./Item";
import Pagination from "./Pagination";
import { perPage } from "../config";

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
      id
      title
      description
      image
      largeImage
      price
      createdAt
      updatedAt
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const StyledItems = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  @media (max-width: ${props => props.theme.singleItemSize}) {
    grid-template-columns: 1fr;
    justify-content: center;
  }
`;

export default class Items extends Component {
  render() {
    const skip = this.props.page * perPage - perPage;
    return (
      <Center>
        <Pagination page={this.props.page} />
        <Query query={ALL_ITEMS_QUERY} variables={{ skip }}>
          {({ data, error, loading }) => {
            if (error) {
              return <p>Hey fella, I've got an error {error}</p>;
            }
            if (loading) {
              return <p>Hey fella, I'm still loading</p>;
            }
            return (
              <StyledItems>
                {data.items.map(item => (
                  <Item item={item} key={item.id}>
                    item.title
                  </Item>
                ))}
              </StyledItems>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}
