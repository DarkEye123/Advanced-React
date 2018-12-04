import React, { Component } from "react";
import gql from "graphql-tag";
import { ApolloConsumer } from "react-apollo";
import debounce from "lodash.debounce";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const QUERY_DROPDOWN_ITEMS = gql`
  query QUERY_DROPDOWN_ITEMS($searchTerm: String!) {
    items(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
      id
      image
      title
    }
  }
`;

export default class Search extends Component {
  state = {
    loading: false,
    items: [],
  };

  routeToItem = (item, _) => {
    Router.push({
      pathname: "/item",
      query: {
        id: item.id,
      },
    });
  };

  handleQuery = debounce(async (e, client) => {
    this.setState({
      loading: true,
    });
    const res = await client.query({ query: QUERY_DROPDOWN_ITEMS, variables: { searchTerm: e.target.value } });
    this.setState({
      loading: false,
      items: res.data.items,
    });
  }, 350);
  render() {
    return (
      resetIdCounter() || (
        <SearchStyles>
          <Downshift onChange={this.routeToItem} itemToString={item => (item ? item.title : "")}>
            {({ getInputProps, getItemProps, highlightedIndex, isOpen, inputValue }) => (
              <div>
                {/* when a fragment was used it shown strange error -> see https://github.com/paypal/downshift#getrootprops */}
                <ApolloConsumer>
                  {client => (
                    <input
                      {...getInputProps({
                        onChange: e => {
                          e.persist();
                          this.handleQuery(e, client);
                        },
                        type: "search",
                        placeholder: "Search for an Item",
                        className: (this.state.loading && "loading") || "",
                        disabled: this.state.loading,
                      })}
                    />
                  )}
                </ApolloConsumer>
                {isOpen && (
                  <DropDown>
                    {this.state.items.map((item, index) => (
                      <DropDownItem key={item.id} {...getItemProps({ item })} highlighted={index === highlightedIndex}>
                        <img width={50} src={item.image} alt={item.title} />
                        {item.title}
                      </DropDownItem>
                    ))}
                    {!this.state.loading && !this.state.items.length && (
                      <DropDownItem>Item {inputValue} was not found</DropDownItem>
                    )}
                  </DropDown>
                )}
              </div>
            )}
          </Downshift>
        </SearchStyles>
      )
    );
  }
}
