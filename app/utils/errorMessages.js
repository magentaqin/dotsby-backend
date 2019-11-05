const GlobalErrorCodes = {
  SERVER_ERROR: 'SERVER_ERROR',
  AUTH_FAILED: 'AUTH_FAILED',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS'
}

const GlobalErr = {
  [GlobalErrorCodes.SERVER_ERROR]: 'Server is not available now',
  [GlobalErrorCodes.AUTH_FAILED]: 'User is not authenticated.',
  [GlobalErrorCodes.OPERATION_NOT_ALLOWED]: 'You have no access to this resource.',
}


module.exports = {
  GlobalErrorCodes,
  GlobalErr,
}
