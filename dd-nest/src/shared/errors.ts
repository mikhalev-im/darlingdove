export class CustomError extends Error {
  constructor(readonly message: string, readonly code: string) {
    super(message);

    this.code = code;
  }
}
