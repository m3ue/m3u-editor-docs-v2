import React from 'react';
import styles from './styles.module.css';

/**
 * A numbered walkthrough with a line joining the steps. Use in MDX:
 *
 *   <Steps>
 *   <Step title="Get the file">
 *
 *   Markdown, code blocks, admonitions...
 *
 *   </Step>
 *   </Steps>
 *
 * Leave blank lines inside each Step so MDX parses its body as markdown.
 * Step titles aren't headings, so they don't appear in the table of
 * contents; put a heading above the Steps if the section needs one.
 */
export function Steps({ children }) {
  const steps = React.Children.toArray(children).filter(React.isValidElement);
  return (
    <ol className={styles.steps}>
      {steps.map((step, index) => React.cloneElement(step, { number: index + 1 }))}
    </ol>
  );
}

export function Step({ number, title, children }) {
  return (
    <li className={styles.step}>
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {children && <div className={styles.content}>{children}</div>}
      </div>
    </li>
  );
}

export default Steps;
