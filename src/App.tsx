import * as React from 'react';
import {
  Route
} from 'react-router'
import {
  BrowserRouter, Switch
} from 'react-router-dom';
import MainScreen from './screens/main';
import SignInScreen from './screens/sign_in';

import Notification from 'jojje-react-notification';

import './styles/text.css';
import './styles/table.css';

export default class App extends React.Component {
  public render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route path="/" component={MainScreen} />
            <Route path="/sign_in" component={SignInScreen} />
          </Switch>
        </BrowserRouter>
        <Notification shared={true} />
      </div>
    );
  }
}