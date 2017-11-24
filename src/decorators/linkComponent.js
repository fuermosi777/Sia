import React from 'react';

export default function linkComponent(props) {
  const { href, title } = props.contentState
    .getEntity(props.entityKey)
    .getData();

  return (
    <a href={href} title={title}>
      {props.children}
    </a>
  );
};
