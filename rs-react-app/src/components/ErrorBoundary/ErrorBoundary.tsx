import React, { type ReactNode } from 'react';
import ErrorDescription from '../ErrorDescription/ErrorDescription';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Произошла неизвестная ошибка.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Ошибка в ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.errorMessage) {
      return <ErrorDescription message={this.state.errorMessage} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
