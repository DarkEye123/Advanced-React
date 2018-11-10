import React, { Component } from "react";
import NProgress from "nprogress";
export default class Loading extends Component {
  componentDidMount() {
    NProgress.start();
  }
  componentWillUnmount() {
    NProgress.done();
  }
  render() {
    return <p>Loading...</p>;
  }
}
