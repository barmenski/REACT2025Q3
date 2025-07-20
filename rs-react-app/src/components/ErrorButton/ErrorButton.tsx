import React from 'react';

interface ErrorButtonState {
  shouldThrowError: boolean;
}

class ErrorButton extends React.Component<object, ErrorButtonState> {
  constructor(props: object) {
    super(props);
    this.state = { shouldThrowError: false };
    this.triggerError = this.triggerError.bind(this);
  }

  triggerError() {
    this.setState({ shouldThrowError: true });
  }

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Test Error from Button');
    }
    return (
      <button className="error-button" onClick={this.triggerError}>
        Error Button
      </button>
    );
  }
}

export default ErrorButton;
