export default class TokenUidAlreadyTakenError extends Error {
    constructor() {
        super("The uuid of the token is already taken");
    }
}