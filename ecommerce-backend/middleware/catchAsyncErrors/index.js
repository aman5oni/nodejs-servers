const asyncErrorHandler = controlFunction => (req,res,next) => {
    Promise.resolve(controlFunction(req,res,next)).catch(next)
}

export default asyncErrorHandler