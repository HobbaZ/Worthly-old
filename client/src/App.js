import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Profile from './pages/Profile';
import SearchItems from './pages/SearchItems';
import SavedItems from './pages/SavedItems';
import Footer from './components/Footer';
import AppNavBar from './components/NavBar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <AppNavBar/>
          <div className="container">

          <Switch>
          <Route exact path='/' component={SearchItems} />
          <Route exact path='/saved' component={SavedItems} />
          <Route exact path='/profile' component={Profile} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
        </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
