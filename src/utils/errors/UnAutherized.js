class UnAuthorizedException extends Error {
  constructor(message) {
    super(message || 'Not Authorized');
    this.status = 401;
  }
}

module.exports = UnAuthorizedException;
