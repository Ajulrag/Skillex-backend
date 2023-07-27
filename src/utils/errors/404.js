export default function NotFound(req, res, next) {
    const notFoundError = new Error('End point not found');
    notFoundError.status = 404;
    next(notFoundError);
}