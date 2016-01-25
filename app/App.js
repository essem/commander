import React from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';
import { Button, ButtonToolbar, Input, Grid, Row, Col } from 'react-bootstrap';
import childProcess from 'child_process';
import fs from 'fs';
import yaml from 'js-yaml';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const commands = yaml.load(fs.readFileSync('config/commands.yml', 'utf8'));
    this.state = {
      state: 'idle',
      commands,
      editor: '',
      output: '',
      exitCode: 0,
    };

    this.handleCommand = this.handleCommand.bind(this);
    this.handleEditor = this.handleEditor.bind(this);
    this.handleRun = this.handleRun.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', () => {
      const topBar = ReactDOM.findDOMNode(this.refs.topBar);

      if (document.body.scrollTop === 0) {
        topBar.classList.remove(styles.topBarFixed);
      } else {
        topBar.classList.add(styles.topBarFixed);
      }
    });
  }

  run(command) {
    this.setState({ state: 'run', output: '' });

    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp');
    }

    fs.writeFileSync('tmp/command.sh', command, 'utf-8');
    fs.chmodSync('tmp/command.sh', '755');

    const child = childProcess.spawn('tmp/command.sh');

    child.stdout.on('data', (data) => {
      this.setState({ output: this.state.output + data }, () => {
        document.body.scrollTop = document.body.scrollHeight;
      });
    });

    child.stderr.on('data', (data) => {
      this.setState({ output: this.state.output + data }, () => {
        document.body.scrollTop = document.body.scrollHeight;
      });
    });

    child.on('close', (code) => {
      this.setState({ state: 'idle', exitCode: code });
    });
  }

  handleCommand(e) {
    let command = this.state.commands[e.target.dataset.index].command;
    const start = command.indexOf('{{');

    if (start > -1) {
      command = command.substr(0, start) + command.substr(start + 2);
      let end = command.indexOf('}}');

      if (end > -1) {
        command = command.substr(0, end) + command.substr(end + 2);
      } else {
        end = command.length;
      }

      const textarea = this.refs.textarea.getInputDOMNode();
      this.setState({ editor: command }, () => {
        textarea.setSelectionRange(start, end);
        textarea.focus();
      });
    } else {
      this.setState({ editor: command });
      this.run(command);
    }
  }

  handleEditor(e) {
    this.setState({ editor: e.target.value });
  }

  handleRun() {
    this.run(this.state.editor);
  }

  render() {
    return (
      <div>
      <div className={styles.topBar} ref="topBar">
      <Grid>
      <Row className={styles.row}>
        <Col md={12}>
          <ButtonToolbar>
            {this.state.commands.map((command, i) =>
              (
                <Button
                  key={i}
                  bsStyle="primary"
                  data-index={i}
                  disabled={this.state.state !== 'idle'}
                  onClick={this.handleCommand}
                >
                  {command.name}
                </Button>
              )
            )}
          </ButtonToolbar>
        </Col>
      </Row>

      <Row className={styles.row}>
        <Col md={12}>
          <Input
            type="textarea"
            value={this.state.editor}
            ref="textarea"
            disabled={this.state.state !== 'idle'}
            onChange={this.handleEditor}
          />
        </Col>

        <Col md={12}>
          <Button
            bsStyle="primary"
            disabled={this.state.state !== 'idle'}
            onClick={this.handleRun}
          >
            Run
          </Button>
        </Col>
      </Row>
      </Grid>
      </div>

      <div className={styles.output}>
      <Grid>
      <Row className={styles.row}>
        <Col md={12}>
          <pre>{this.state.output}</pre>
          {this.state.state === 'run' ? 'Running...' : `Exit: ${this.state.exitCode}`}
        </Col>
      </Row>
      </Grid>
      </div>
      </div>
    );
  }
}
