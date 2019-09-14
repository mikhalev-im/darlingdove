import * as Handlebars from 'handlebars';
import orderTemplate from './order';
import registerTemplate from './register';

export const compileTemplates = () => {
  return {
    order: Handlebars.compile(orderTemplate),
    register: Handlebars.compile(registerTemplate),
  };
};
