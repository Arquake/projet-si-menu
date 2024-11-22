export default class TokenNotFoundError extends Error {
    constructor() {
        super("No refresh token matched");
    }
}