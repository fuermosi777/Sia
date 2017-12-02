import React from 'react';

class Link extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a href={this.props.href} title={this.props.title}>
        {this.props.children}
      </a>
    );
    
  }
}

export default function linkComponent(props) {
  const { href, title } = props.contentState
    .getEntity(props.entityKey)
    .getData();

  return (
    <Link href={href} title={title}>
      {props.children}
    </Link>
  );
};
