export default function globalErrorHandler(error, req, res, next) {
    res.status(error?.status || 500).json({
      error: {
        status: error?.status || 500,
        message: error?.message || 'Internal server error',
      },
    });
  }
  