class errResponse {
    constructor(statusCode, data = {}, message="fail") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = false;
    }
}

export default errResponse;