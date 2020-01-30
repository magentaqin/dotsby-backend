const GlobalErrorCodes = {
  SERVER_ERROR: 'SERVER_ERROR',
  AUTH_FAILED: 'AUTH_FAILED',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
}

const UserErrorCodes = {
  EMAIL_ALREADY_EXISTED: 'EMAIL_ALREADY_EXISTED',
  EMAIL_NOT_EXIST: 'EMAIL_NOT_EXIST',
  EMAIL_PASSWORD_NOT_MATCH: 'EMAIL_PASSWORD_NOT_MATCH',
}

const DocErrorCodes = {
  CREATE_BEFORE_PUBLISH: 'CREATE_BEFORE_PUBLISH',
  INITIAL_VERSION_MUST_PUBLISH: 'INITIAL_VERSION_MUST_PUBLISH',
}

const GlobalErr = {
  [GlobalErrorCodes.SERVER_ERROR]: 'Server is not available now',
  [GlobalErrorCodes.AUTH_FAILED]: 'User is not authenticated.',
  [GlobalErrorCodes.OPERATION_NOT_ALLOWED]: 'You have no access to this resource.',
}

const UserErr = {
  [UserErrorCodes.EMAIL_ALREADY_EXISTED]: 'Email already existed.Please try another email.',
  [UserErrorCodes.EMAIL_NOT_EXIST]: 'Email does not exist.',
  [UserErrorCodes.EMAIL_PASSWORD_NOT_MATCH]: 'Email does not match with password.',
}

const DocErr = {
  [DocErrorCodes.CREATE_BEFORE_PUBLISH]: 'You have to create document in Dotsby Dashboard before publishing.',
  [DocErrorCodes.INITIAL_VERSION_MUST_PUBLISH]: 'You have to publish the initial version of doc before.',
}


module.exports = {
  GlobalErrorCodes,
  GlobalErr,
  UserErrorCodes,
  UserErr,
  DocErrorCodes,
  DocErr,
}
