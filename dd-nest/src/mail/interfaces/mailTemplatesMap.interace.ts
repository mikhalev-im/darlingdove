export interface MailTemplatesMap {
  readonly order: (data, options) => string;
  readonly register: (data?) => string;
}
