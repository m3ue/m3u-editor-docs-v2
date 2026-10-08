import React from 'react';
import DocCardList from '@theme/DocCardList';

/**
 * A grid of link cards in the same style as the category index pages
 * (they render through our DocCard). Each item: { to, title, text, icon }.
 * `icon` is a Material Symbols name listed in MATERIAL_ICONS.
 */
export default function LinkCards({ items }) {
  return (
    <DocCardList
      items={items.map((item) => ({
        type: 'link',
        href: item.to,
        label: item.title,
        description: item.text,
        customProps: item.icon ? { icon: item.icon } : undefined,
      }))}
    />
  );
}
