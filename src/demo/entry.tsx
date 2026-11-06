import { createRoot } from 'react-dom/client';
import { Component, type ReactNode } from 'react';
import { DemoApp } from './app';
import '../app/globals.css';
import './styles.css';
class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="d-start-error">
        <h1>Die Demo konnte nicht geöffnet werden.</h1>
        <p>
          Ein beschädigter Browserstand kann die Ursache sein. Du kannst nur die fiktiven Demo-Daten
          dieses Tabs zurücksetzen.
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem('orglens.frontend-demo.v1');
            location.reload();
          }}
        >
          Demostand zurücksetzen
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById('root')!).render(
  <DemoBoundary>
    <DemoApp />
  </DemoBoundary>,
);
