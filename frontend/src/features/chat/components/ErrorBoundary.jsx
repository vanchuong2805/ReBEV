// src/components/ErrorBoundary.jsx
import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h3>Đã xảy ra lỗi trong giao diện trò chuyện.</h3>
          <p style={{ color: "#b91c1c" }}>{this.state.error?.message ?? String(this.state.error)}</p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.info?.componentStack}
          </details>
          <button onClick={() => window.location.reload()} style={{ marginTop: 12 }}>
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
