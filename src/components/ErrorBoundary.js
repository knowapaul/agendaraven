import React from 'react';
import { Paper, Typography } from '@mui/material'

export class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }
    
    componentDidCatch(error, errorInfo) {
      // Catch errors in any components below and re-render with error message
      this.setState({
        error: error,
        errorInfo: errorInfo
      })
      // You can also log error messages to an error reporting service here
    }
    
    render() {
      if (this.state.errorInfo) {
        // Error path
        return (
            <Paper sx={{padding: 2, margin: 2, maxHeight: 'calc(100% - 32px)', overflow: 'auto'}}>
                {this.props.pc}
                <Typography sx={{mb: 2}}>
                    Sorry, something went wrong. This component does not appear to be working right now. 
                    Try refreshing the page and repeating your last action again.
                </Typography>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                </details>
            </Paper>
        );
      }
      // Normally, just render children
      return this.props.children;
    }  
  }
  