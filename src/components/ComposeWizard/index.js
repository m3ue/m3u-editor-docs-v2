import React, { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import {
  DEPLOYMENT_TYPES,
  WIZARD_SECTIONS,
  FIELD_TYPES,
  generateToken,
  getDefaultValues,
} from '@site/src/data/composeWizardConfig';
import { generateComposeFile, generateEnvFile } from '@site/src/data/composeTemplates';
import styles from './styles.module.css';

// Field component for rendering form inputs
const WizardField = ({ variable, value, onChange, allValues }) => {
  const { name, label, description, type, options, placeholder, generateButton } = variable;

  const handleChange = (e) => {
    const newValue = type === FIELD_TYPES.BOOLEAN
      ? e.target.checked
      : e.target.value;
    onChange(name, newValue);
  };

  const handleGenerate = () => {
    onChange(name, generateToken(32));
  };

  const renderInput = () => {
    switch (type) {
      case FIELD_TYPES.SELECT:
        return (
          <select
            id={name}
            value={value || ''}
            onChange={handleChange}
            className={styles.select}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case FIELD_TYPES.BOOLEAN:
        return (
          <label className={styles.toggle}>
            <input
              type="checkbox"
              id={name}
              checked={!!value}
              onChange={handleChange}
            />
            <span className={styles.toggleSlider}></span>
            <span className={styles.toggleLabel}>{value ? 'Enabled' : 'Disabled'}</span>
          </label>
        );

      case FIELD_TYPES.PASSWORD:
        return (
          <div className={styles.inputGroup}>
            <input
              type="text"
              id={name}
              value={value || ''}
              onChange={handleChange}
              placeholder={placeholder}
              className={styles.input}
            />
            {generateButton && (
              <button
                type="button"
                onClick={handleGenerate}
                className={styles.generateBtn}
                title="Generate random token"
              >
                Generate
              </button>
            )}
          </div>
        );

      case FIELD_TYPES.NUMBER:
        return (
          <input
            type="number"
            id={name}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.input}
          />
        );

      case FIELD_TYPES.TEXTAREA:
        return (
          <textarea
            id={name}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.textarea}
            rows={4}
          />
        );

      default:
        return (
          <input
            type="text"
            id={name}
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.input}
          />
        );
    }
  };

  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {variable.required && <span className={styles.required}>*</span>}
      </label>
      {renderInput()}
      {description && <p className={styles.fieldDescription}>{description}</p>}
    </div>
  );
};

// Section component
const WizardSection = ({ section, values, onChange, deploymentType }) => {
  const [isCollapsed, setIsCollapsed] = useState(section.collapsed || false);

  // Filter variables for current deployment type
  const visibleVariables = section.variables.filter((variable) => {
    // Check deployment type
    if (!variable.deploymentTypes.includes(deploymentType)) {
      return false;
    }

    // Check conditional visibility
    if (variable.showWhen) {
      const { field, value, values: allowedValues } = variable.showWhen;
      const currentValue = values[field];

      if (allowedValues) {
        return allowedValues.includes(currentValue);
      }
      return currentValue === value;
    }

    return true;
  });

  // Hide section if no visible variables or not applicable to deployment type
  if (visibleVariables.length === 0) {
    return null;
  }

  // Check if section is limited to certain deployment types
  if (section.deploymentTypes && !section.deploymentTypes.includes(deploymentType)) {
    return null;
  }

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
      >
        <span className={styles.sectionIcon}>{section.icon}</span>
        <span className={styles.sectionTitle}>{section.title}</span>
        <span className={styles.sectionDescription}>{section.description}</span>
        <span className={clsx(styles.sectionChevron, !isCollapsed && styles.expanded)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {!isCollapsed && (
        <div className={styles.sectionContent}>
          {visibleVariables.map((variable) => (
            <WizardField
              key={variable.name}
              variable={variable}
              value={values[variable.name]}
              onChange={onChange}
              allValues={values}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Deployment type selector
const DeploymentTypeSelector = ({ selected, onSelect }) => {
  return (
    <div className={styles.deploymentTypes}>
      <h3 className={styles.stepTitle}>1. Select Deployment Type</h3>
      <div className={styles.deploymentGrid}>
        {DEPLOYMENT_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={clsx(
              styles.deploymentCard,
              selected === type.id && styles.selected,
              type.recommended && styles.recommended
            )}
            onClick={() => onSelect(type.id)}
          >
            {type.recommended && <span className={styles.recommendedBadge}>Recommended</span>}
            <h4 className={styles.deploymentName}>{type.name}</h4>
            <p className={styles.deploymentDescription}>{type.description}</p>
            <ul className={styles.featureList}>
              {type.features?.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <span className={styles.checkIcon}>✓</span> {feature}
                </li>
              ))}
              {type.limitations?.map((limitation, idx) => (
                <li key={idx} className={clsx(styles.featureItem, styles.limitation)}>
                  <span className={styles.crossIcon}>✗</span> {limitation}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
};

// Code output component
const CodeOutput = ({ title, code, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.codeOutput}>
      <div className={styles.codeHeader}>
        <span className={styles.codeTitle}>{title}</span>
        <div className={styles.codeActions}>
          <button
            type="button"
            onClick={handleCopy}
            className={styles.codeBtn}
            title="Copy to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className={styles.codeBtn}
            title="Download file"
          >
            Download
          </button>
        </div>
      </div>
      <pre className={styles.codeBlock}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Main wizard component
export default function ComposeWizard() {
  const [deploymentType, setDeploymentType] = useState('modular');
  const [values, setValues] = useState(() => getDefaultValues('modular'));
  const [showOutput, setShowOutput] = useState(false);

  const handleDeploymentChange = useCallback((type) => {
    setDeploymentType(type);
    setValues(getDefaultValues(type));
    setShowOutput(false);
  }, []);

  const handleValueChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleGenerate = () => {
    setShowOutput(true);
  };

  const handleReset = () => {
    setValues(getDefaultValues(deploymentType));
    setShowOutput(false);
  };

  const composeOutput = useMemo(() => {
    if (!showOutput) return '';
    return generateComposeFile(deploymentType, values);
  }, [showOutput, deploymentType, values]);

  const envOutput = useMemo(() => {
    if (!showOutput) return '';
    return generateEnvFile(values);
  }, [showOutput, values]);

  return (
    <div className={styles.wizard}>
      <div className={styles.wizardContent}>
        <DeploymentTypeSelector
          selected={deploymentType}
          onSelect={handleDeploymentChange}
        />

        <div className={styles.configuration}>
          <h3 className={styles.stepTitle}>2. Configure Settings</h3>
          <p className={styles.stepDescription}>
            Customize your deployment. Collapsed sections contain optional advanced settings.
          </p>

          {WIZARD_SECTIONS.map((section) => (
            <WizardSection
              key={section.id}
              section={section}
              values={values}
              onChange={handleValueChange}
              deploymentType={deploymentType}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleGenerate}
            className={styles.generateButton}
          >
            Generate Docker Compose
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset to Defaults
          </button>
        </div>

        {showOutput && (
          <div className={styles.output}>
            <h3 className={styles.stepTitle}>3. Your Configuration</h3>
            <p className={styles.stepDescription}>
              Copy or download the files below. Save them in the same directory and run{' '}
              <code>docker-compose up -d</code> to start.
            </p>

            <CodeOutput
              title="docker-compose.yml"
              code={composeOutput}
              filename="docker-compose.yml"
            />

            {envOutput.split('\n').length > 3 && (
              <CodeOutput
                title=".env (Optional - for sensitive values)"
                code={envOutput}
                filename=".env"
              />
            )}

            <div className={styles.quickStart}>
              <h4>Quick Start Commands</h4>
              <pre className={styles.commandBlock}>
                <code>{`# Download and start
# Save the above file as docker-compose.yml, then:
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down`}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
