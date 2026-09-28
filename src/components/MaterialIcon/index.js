import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Material Symbols (Rounded) icon, rendered from the Google Fonts icon font.
 *
 * The font is subset to the names listed in MATERIAL_ICONS in
 * docusaurus.config.js. When using a new icon, add its name there too or it
 * will render as plain text. Browse names at https://fonts.google.com/icons
 */
export default function MaterialIcon({ name, filled = false, size, className, style }) {
  return (
    <span
      className={clsx(styles.icon, filled && styles.filled, className)}
      style={size ? { fontSize: size, ...style } : style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
