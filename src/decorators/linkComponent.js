import React from 'react';

class Link extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFocus() {
    console.log(1);
    
  }

  render() {
    let { href, title } = this.props;

    return (
      <a href={href} title={title} onFocus={this.handleFocus.bind(this)}>
        {this.props.children}
      </a>
    );
    
  }
}

export default function linkComponent(props) {
  const { href, title } = props.contentState
    .getEntity(props.entityKey)
    .getData();

  return <Link {...props}/>;
};
