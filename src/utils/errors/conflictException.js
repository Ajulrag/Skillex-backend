export default class ConflictException extends Error {
    constructor(message) {
      super(message || 'Conflict Exception');
      this.status = 409;
    }
  }
  