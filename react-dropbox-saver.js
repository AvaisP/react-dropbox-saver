import React, { Component } from 'react';
import loadScript from 'load-script';

const DROPBOX_SDK_URL = 'https://www.dropbox.com/static/api/2/dropins.js';
const SCRIPT_ID = 'dropboxjs';

let scriptLoadingStarted = false;

// read more
// https://www.dropbox.com/developers/saver
export default class DropboxSaver extends Component {

  constructor(props) {
    super(props);

    this.onChoose = this.onChoose.bind(this);
  }

  componentDidMount() {
    if (!this.isDropboxReady() && !scriptLoadingStarted) {
      scriptLoadingStarted = true;
      loadScript(DROPBOX_SDK_URL, {
        attrs : {
          id: SCRIPT_ID,
          'data-app-key': this.props.appKey
        }
      });
    }
  }

  isDropboxReady() {
    return !!window.Dropbox;
  }

  onChoose() {
    if (!this.isDropboxReady() || this.props.disabled) {
      return null;
    }

    const {
      url,
      success,
      progress,
      cancel,
      error
    } = this.props;
    
    ////console.log(url);

    window.Dropbox.save(url, 'Avais.png', {
      success,
      progress,
      cancel,
      error
    });
  }

  render() {
    return (
      <div onClick={this.onChoose}>
        {
          this.props.children ?
              this.props.children :
              <button>Open dropbox chooser</button>
        }
      </div>
    );
  }
}

DropboxSaver.propTypes = {
  children: React.PropTypes.node,
  url: React.PropTypes.string,
  appKey: React.PropTypes.string.isRequired,
  success: React.PropTypes.func.isRequired,
  progress: React.PropTypes.func,
  cancel: React.PropTypes.func,
  error: React.PropTypes.func,
  extensions: React.PropTypes.arrayOf(React.PropTypes.string),
  disabled: React.PropTypes.bool
};

DropboxSaver.defaultProps = {
  cancel: () => {},
  progress: () => {},
  disabled: false
};