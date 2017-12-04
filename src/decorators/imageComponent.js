import React from 'react';

class Image extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: props.src,
      alt: props.alt,
      title: props.title
    }
  }
  handleClick = () => {
    this.props.onEditing();
  }
  render() {
    return (
      <span onClick={this.handleClick}>
        {this.props.children}
        <img src={this.state.src} alt={this.state.alt} title={this.state.title} />
        <div>
          ![{this.state.alt}]({this.state.src})
        </div>
      </span>
    );
  }
}

export default function imageComponent(props) {
  const { src, alt, title } = props.contentState.getEntity(props.entityKey).getData();

  return <Image src={src} alt={alt} title={title} onEditing={props.onEditing}>{props.children}</Image>;
}