export default class TokenCreationfailedError extends Error {

    constructor() {
        super("The token creation has failed");
    }
}