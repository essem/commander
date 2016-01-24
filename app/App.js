import React from 'react';
import styles from './App.css';
import { Panel } from 'react-bootstrap';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
  }
  render() {
    return (
      <div className={styles.app}>
      <Panel header="Hello World!">
        We are using node {process.versions.node},
        Chrome {process.versions.chrome},
        and Electron {process.versions.electron}.
      </Panel>
      </div>
    );
  }
}
