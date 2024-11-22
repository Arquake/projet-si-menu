export default class InvalidJwtError extends Error {

    constructor() {
        super("The jwt has expired");
    }
}