/**
 * Ejected from @docusaurus/theme-classic DocCard (3.9) for the category index
 * pages. The emoji icons are replaced with Material Symbols, the description
 * wraps to two lines instead of truncating, and an arrow badge mirrors the
 * previous/next cards.
 *
 * A doc or category can pick its own icon with
 * `sidebar_custom_props: { icon: 'name' }` (frontmatter or _category_.json
 * `customProps`). Add the name to MATERIAL_ICONS in docusaurus.config.js.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {usePluralForm} from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import MaterialIcon from '@site/src/components/MaterialIcon';
import styles from './styles.module.css';

function useCategoryItemsPlural() {
  const {selectMessage} = usePluralForm();
  return (count) =>
    selectMessage(
      count,
      translate(
        {
          message: '1 item|{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        {count},
      ),
    );
}

function CardLayout({className, href, icon, title, description}) {
  return (
    <Link href={href} className={clsx(styles.card, className)}>
      <span className={styles.icon}>
        <MaterialIcon name={icon} />
      </span>
      <span className={styles.body}>
        <Heading as="h2" className={styles.title} title={title}>
          {title}
        </Heading>
        {description && (
          <p className={styles.description} title={description}>
            {description}
          </p>
        )}
      </span>
      <span className={styles.arrow} aria-hidden="true" />
    </Link>
  );
}

function CardCategory({item}) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <CardLayout
      className={item.className}
      href={href}
      icon={item.customProps?.icon ?? 'folder'}
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}

function CardLink({item}) {
  const doc = useDocById(item.docId ?? undefined);
  const defaultIcon = isInternalUrl(item.href) ? 'description' : 'open_in_new';
  return (
    <CardLayout
      className={item.className}
      href={item.href}
      icon={item.customProps?.icon ?? defaultIcon}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
