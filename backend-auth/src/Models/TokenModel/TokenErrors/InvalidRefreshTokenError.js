export default class InvalidRefreshTokenError extends Error {

    constructor() {
        super('The refresh token is invalid');
    }
}