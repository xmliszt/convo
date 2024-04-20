export class ConvoError extends Error {
  constructor(message: string, stack?: any) {
    super(message);
    this.name = 'ConvoError';
    this.stack = stack;
  }
}
