import App, { Container } from "next/app";
import Page from "../components/Page";
import { ApolloProvider } from "react-apollo";
import withData from "../lib/withData";
class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    //this is really important for starting all queries I have for the page before the actual rendering (cart etc...)
    // so it basically crawl all the pages, run its queries and resolves them
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <Container>
          <Page>
            <Component {...pageProps} />
          </Page>
        </Container>
      </ApolloProvider>
    );
  }
}

export default withData(MyApp);
