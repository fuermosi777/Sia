import imageStrategy from './imageStrategy';
import imageComponent from './imageComponent';

export default function createImageDecorator(onEditing) {
  return {
    strategy: imageStrategy,
    component: imageComponent,
    props: {
      onEditing
    }
  }
};
