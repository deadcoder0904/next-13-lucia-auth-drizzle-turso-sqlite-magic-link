export const IS_DEV = process.env['NODE_ENV'] === 'development' ? 'DEV' : 'PROD'
export const EMAIL_VERIFICATION_URL = `${process.env['BASE_URL']}/verify-email`
