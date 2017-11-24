import React from 'react';

export default function Image({ entityKey, children, contentState }) {
  const { src, alt, title } = contentState.getEntity(entityKey).getData();

  return (
    <span>
      {children}
      <img src={src} alt={alt} title={title} />
    </span>
  );
}