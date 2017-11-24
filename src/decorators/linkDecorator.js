import linkStrategy from './linkStrategy';
import linkComponent from './linkComponent';

export default function createLinkDecorator() {
  return {
    strategy: linkStrategy,
    component: linkComponent
  }
};
