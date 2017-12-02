import React from 'react';

class Image extends React.Component {
  handleClick = () => {
    console.log(1);
    
  }
  render() {
    return (
      <a onClick={this.handleClick}>
        {this.props.children}
        <img src={this.props.src} alt={this.props.alt} title={this.props.title} />
      </a>
    );
  }
}

export default function imageComponent(props) {
  const { src, alt, title } = props.contentState.getEntity(props.entityKey).getData();

  return <Image src={src} alt={alt} title={title}>{props.children}</Image>;
}