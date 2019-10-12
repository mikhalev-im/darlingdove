export interface MailTemplatesMap {
  readonly order: (data) => string;
  readonly register: (data?) => string;
}
