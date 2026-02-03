import React, { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import CodeBlock from '@theme/CodeBlock';
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
  const [isCollapsed, setIsCollapsed] = useState(section.collapsed || section.id !== 'application');

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

// Deployment type selector (compact tabs)
const DeploymentTypeTabs = ({ selected, onSelect }) => {
  return (
    <div className={styles.deploymentTabs}>
      {DEPLOYMENT_TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          className={clsx(
            styles.deploymentTab,
            selected === type.id && styles.activeTab,
            type.recommended && styles.recommendedTab
          )}
          onClick={() => onSelect(type.id)}
          title={type.description}
        >
          {type.name}
          {type.recommended && <span className={styles.recBadge}>⭐️</span>}
        </button>
      ))}
    </div>
  );
};

// Live code preview component
const LivePreview = ({ code, filename, envCode }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (content, name) => {
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasEnvFile = envCode && envCode.split('\n').length > 3;

  return (
    <div className={styles.livePreview}>
      <div className={styles.previewHeader}>
        <div className={styles.previewTabs}>
          <button
            type="button"
            className={clsx(styles.previewTab, activeTab === 'compose' && styles.activePreviewTab)}
            onClick={() => setActiveTab('compose')}
          >
            docker-compose.yml
          </button>
          {hasEnvFile && (
            <button
              type="button"
              className={clsx(styles.previewTab, activeTab === 'env' && styles.activePreviewTab)}
              onClick={() => setActiveTab('env')}
            >
              .env
            </button>
          )}
        </div>
        <div className={styles.previewActions}>
          <button
            type="button"
            onClick={() => handleCopy(activeTab === 'compose' ? code : envCode)}
            className={styles.actionBtn}
            title="Copy to clipboard"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => handleDownload(
              activeTab === 'compose' ? code : envCode,
              activeTab === 'compose' ? 'docker-compose.yml' : '.env'
            )}
            className={styles.actionBtn}
            title="Download file"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </button>
        </div>
      </div>
      <div className={styles.previewContent}>
        <CodeBlock
          language={activeTab === 'compose' ? 'yaml' : 'bash'}
          className={styles.codeBlock}
          showLineNumbers
        >
          {activeTab === 'compose' ? code : envCode}
        </CodeBlock>
      </div>
    </div>
  );
};

// Main wizard component
export default function ComposeWizard() {
  const [deploymentType, setDeploymentType] = useState('modular');
  const [values, setValues] = useState(() => getDefaultValues('modular'));

  const handleDeploymentChange = useCallback((type) => {
    setDeploymentType(type);
    setValues(getDefaultValues(type));
  }, []);

  const handleValueChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = () => {
    setValues(getDefaultValues(deploymentType));
  };

  // Live generated output
  const composeOutput = useMemo(() => {
    return generateComposeFile(deploymentType, values);
  }, [deploymentType, values]);

  const envOutput = useMemo(() => {
    return generateEnvFile(values);
  }, [values]);

  // Get current deployment type info
  const currentDeployment = DEPLOYMENT_TYPES.find(d => d.id === deploymentType);

  return (
    <div className={styles.wizard}>
      {/* Deployment Type Selection */}
      <div className={styles.deploymentSection}>
        <DeploymentTypeTabs
          selected={deploymentType}
          onSelect={handleDeploymentChange}
        />
        <p className={styles.deploymentDescription}>
          {currentDeployment?.description}
          {currentDeployment?.recommended && ' (Recommended)'}
        </p>
      </div>

      {/* Main Content - Side by Side */}
      <div className={styles.mainContent}>
        {/* Left: Configuration Panel */}
        <div className={styles.configPanel}>
          <div className={styles.configHeader}>
            <h3 className={styles.configTitle}>Configuration</h3>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetBtn}
              title="Reset to defaults"
            >
              Reset
            </button>
          </div>
          <div className={styles.configSections}>
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
        </div>

        {/* Right: Live Preview */}
        <div className={styles.previewPanel}>
          <LivePreview
            code={composeOutput}
            filename="docker-compose.yml"
            envCode={envOutput}
          />
        </div>
      </div>

      {/* Quick Start Commands */}
      <div className={styles.quickStart}>
        <h4>Quick Start</h4>
        <div className={styles.commandSteps}>
          <div className={styles.commandStep}>
            <span className={styles.stepNumber}>1</span>
            <span>Save the generated <code>docker-compose.yml</code> file</span>
          </div>
          <div className={styles.commandStep}>
            <span className={styles.stepNumber}>2</span>
            <span>Run: <code>docker-compose up -d</code></span>
          </div>
          <div className={styles.commandStep}>
            <span className={styles.stepNumber}>3</span>
            <span>Access at: <code>{values.APP_URL || 'http://localhost'}:{values.APP_PORT || '36400'}</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}
