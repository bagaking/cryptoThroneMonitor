import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import './index.less';
import ToolPage from './toolpage';

import {
  HashRouter as Router, Route, Switch,
} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" component={ToolPage} exact />
            <Route path="/:tab" component={ToolPage} exact />
            <Route path="/tool/" component={ToolPage} exact />
          </Switch>
        </Router>
      </Provider>
    );
  }git
}

render(
  <App />,
  document.getElementById('app'),
);

module.hot.accept();
