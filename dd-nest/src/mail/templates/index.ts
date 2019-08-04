import * as Handlebars from 'handlebars';
import orderTemplate from './order';

export const compileTemplates = () => {
  return {
    order: Handlebars.compile(orderTemplate),
  };
};
