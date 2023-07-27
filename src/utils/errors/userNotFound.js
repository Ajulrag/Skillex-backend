class UserNotFound extends Error {
  constructor(message) {
    super(message || 'user not found');
    this.status = 404;
  }
}

module.exports = UserNotFound;
