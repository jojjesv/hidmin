import * as React from 'react';

import './styles.css';

/**
 * A task indicator.
 * @author Johan Svensson
 */
export default class TaskIndicator extends React.Component {
  render() {
    return (
      <img src={require('./spinner.gif')} alt="Please wait" className="task-indicator" />
    )
  }
}