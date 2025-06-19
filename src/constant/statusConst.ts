export enum STATUS_CODE {
    OK = 200, // Success
    CREATED = 201, // Resource created successfully
    NO_CONTENT = 204, // No content to return
    BAD_REQUEST = 400, // Bad request due to client error
    UNAUTHORIZED = 401, // Unauthorized access
    FORBIDDEN = 403, // Forbidden access
    NOT_FOUND = 404, // Resource not found
    CONFLICT = 409, // Conflict with current state of the resource
    INTERNAL_SERVER_ERROR = 500, // Internal server error
    SERVICE_UNAVAILABLE = 503, // Service unavailable
    GATEWAY_TIMEOUT = 504, // Gateway timeout
    UNPROCESSABLE_ENTITY = 422, // Unprocessable entity, often used for validation errors
    TOO_MANY_REQUESTS = 429, // Too many requests, rate limiting
    NOT_IMPLEMENTED = 501, // Not implemented
    BAD_GATEWAY = 502, // Bad gateway
    PRECONDITION_FAILED = 412, // Precondition failed
}