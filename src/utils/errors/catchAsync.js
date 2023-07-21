function catchAsync (fn) {
    return (req, res, next) => {
      try {
        fn(req, res, next).catch(error => {
          console.log(error)
          next(error)
        })
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  }
  
  module.exports = {
    catchAsync
  }
  