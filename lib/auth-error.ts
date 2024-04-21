export class ConvoAuthError extends Error {
  constructor(message: string, stack?: any) {
    super(message);
    this.name = 'ConvoAuthError';
    this.stack = stack;
  }
}
