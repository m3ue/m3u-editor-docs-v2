import React from 'react';
import Layout from '@theme/Layout';
import ComposeWizard from '@site/src/components/ComposeWizard';
import styles from './compose-wizard.module.css';

export default function ComposeWizardPage() {
  return (
    <Layout
      title="Docker Compose Wizard"
      description="Generate a custom docker-compose.yml configuration for M3U Editor"
    >
      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className={styles.title}>Docker Compose Wizard ✨</h1>
            <p className={styles.subtitle}>
              Generate a customized <code>docker-compose.yml</code> configuration for your M3U Editor deployment.
              Select your deployment type and configure the settings below.
            </p>
          </header>

          <ComposeWizard />

          <footer className={styles.footer}>
            <p>
              Need help? Check out the{' '}
              <a href="/docs/deployment/docker-compose">Docker Compose documentation</a> or{' '}
              <a href="/docs/advanced/environment-variables">Environment Variables reference</a>.
            </p>
          </footer>
        </div>
      </main>
    </Layout>
  );
}
