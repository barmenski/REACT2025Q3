import React from 'react';

interface LoaderProps {
  loading?: boolean;
}

class Loader extends React.Component<LoaderProps> {
  render() {
    if (!this.props.loading) {
      return null;
    }
    return <div className="loader">⏳ Загрузка...</div>;
  }
}

export default Loader;
