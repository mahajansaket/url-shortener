import React from "react";

import UrlInput from "./Url/UrlInput";
import AlternateUrl from "./Url/AlternateUrl";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SnackbarProvider } from "notistack";

export const client = new ApolloClient({
  uri: "https://welcome-peacock-97.hasura.app/v1/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <SnackbarProvider>
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <UrlInput />
            <AlternateUrl />
          </header>
        </div>
      </ApolloProvider>
    </SnackbarProvider>
  );
};

export default App;
