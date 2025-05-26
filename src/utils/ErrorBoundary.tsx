import { Component, ErrorInfo, ReactNode } from "react";
import toast from "react-hot-toast";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error) {
    // Don't update state to avoid UI fallback
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Caught by Error Boundary:", error, info);
    toast.error("Something went wrong: " + error.message);
  }

  render() {
    // Always render children — don't replace the UI
    return this.props.children;
  }
}

export default ErrorBoundary;
