import React from 'react';

interface ErrorButtonProps {
  onError: () => void;
}

class ErrorButton extends React.Component<ErrorButtonProps> {
  constructor(props: ErrorButtonProps) {
    super(props);
    this.triggerError = this.triggerError.bind(this);
  }

  triggerError() {
    this.props.onError();
  }

  render() {
    return (
      <button className="error-button" onClick={this.triggerError}>
        Error Button
      </button>
    );
  }
}

export default ErrorButton;
