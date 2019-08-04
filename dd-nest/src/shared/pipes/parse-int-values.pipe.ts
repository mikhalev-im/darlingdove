import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseIntValuesPipe implements PipeTransform {
  constructor(private readonly keys: string[] = []) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // nothing to do if no keys passed
    if (!this.keys.length) return;
    // process only objects
    if (typeof value !== 'object' || value === null) return;

    for (const key of this.keys) {
      value[key] = parseInt(value[key], 10) || undefined;
    }

    return value;
  }
}
