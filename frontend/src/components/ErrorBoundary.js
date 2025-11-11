import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container my-5">
          <div className="alert alert-danger">
            <h2>Algo salió mal</h2>
            <p>Ha ocurrido un error. Por favor, recarga la página.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Recargar Página
            </button>
            {this.state.error && (
              <details className="mt-3">
                <summary>Detalles del error</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

