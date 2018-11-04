import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "./Item";

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
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
    return (
      <Center>
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            if (error) {
              return <p>Hey fella, I've got an error {error}</p>;
            }
            if (loading) {
              return <p>Hey fella, I'm still loading</p>;
            }
            return (
              //   <p>
              //     Hey fella, I've got these {data.items.length} items for you: "
              //   </p>
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
      </Center>
    );
  }
}
