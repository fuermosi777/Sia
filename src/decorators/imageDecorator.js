import imageStrategy from './imageStrategy';
import imageComponent from './imageComponent';

export default function createImageDecorator() {
  return {
    strategy: imageStrategy,
    component: imageComponent
  }
};
