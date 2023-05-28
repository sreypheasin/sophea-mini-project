export class AuthRequiredError extends Error {
    constructor(messages = "Authentication required") {
        super(messages);
        this.name = "AuthRequiredError"; // this.name for error.name
    }
}