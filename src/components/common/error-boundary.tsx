import { Component } from 'react';
import { withRouter } from 'next/router';
import type React from 'react';
import type { ReactNode } from 'react';
import type { NextRouter } from 'next/router';

interface ErrorBoundaryProps {
  children: ReactNode;
  router: NextRouter;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars,  no-console */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error({ error, errorInfo });
  }
  /* eslint-enable @typescript-eslint/no-unused-vars, no-console */

  render(): ReactNode {
    if (this.state.hasError) void this.props.router.push('/500');

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
