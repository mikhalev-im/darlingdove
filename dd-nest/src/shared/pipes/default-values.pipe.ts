import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class DefaultValuesPipe implements PipeTransform {
  constructor(private readonly schema: object = {}) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // it could be inline method param
    if (metadata.data) return value || this.schema[metadata.data];
    // build an object if no value passed
    if (value === null || value === undefined) value = {};
    // skip if value is not an object
    if (typeof value !== 'object' || value === null) return;

    Object.keys(this.schema).forEach(key => {
      if (value[key] === null || value[key] === undefined) {
        value[key] = this.schema[key];
      }
    });

    return value;
  }
}
