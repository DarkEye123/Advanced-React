import React, { Component } from "react";
import { Query } from "react-apollo";
import qql from "graphql-tag";
import styled from "styled-components";

const ALL_ITEMS_QUERY = qql`
    query ALL_ITEMS_QUERY {
    items{
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
            console.log(data);
            return (
              //   <p>
              //     Hey fella, I've got these {data.items.length} items for you: "
              //   </p>
              <StyledItems>
                {data.items.map(item => (
                  <p>{item.id}</p>
                ))}
              </StyledItems>
            );
          }}
        </Query>
      </Center>
    );
  }
}
