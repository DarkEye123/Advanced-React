import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";
import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

export default function Pagination(props) {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, error, loading }) => {
        if (loading) return <p>Loading</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const page = props.page;
        return (
          <PaginationStyles>
            <Head>
              <title>
                Sick Fits! | page {page} of {pages}
              </title>
            </Head>
            <Link prefetch href={{ pathname: "/items", query: { page: page - 1 } }}>
              <a aria-disabled={page <= 1} className="prev">
                ⟸ Previous
              </a>
            </Link>
            <p>
              Page {props.page} of {pages}
            </p>
            <p>{count} Items Total</p>
            <Link prefetch href={{ pathname: "/items", query: { page: page + 1 } }}>
              <a aria-disabled={page >= pages} className="next">
                Next ⟹
              </a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
}
