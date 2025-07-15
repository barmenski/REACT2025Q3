import React from 'react';

type ErrorDescriptionProps = {
  message: string;
};

class ErrorDescription extends React.Component<ErrorDescriptionProps> {
  render() {
    return <div className="error-massage">⚠ {this.props.message}</div>;
  }
}

export default ErrorDescription;
