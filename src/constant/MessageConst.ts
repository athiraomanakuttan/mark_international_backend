// basic messages for response 
export enum MESSAGE_CONST {
    SUCCESS = "Success",
    CREATED = "Resource created successfully",
    NO_CONTENT = "No content to return",
    BAD_REQUEST = "Bad request due to client error",
    UNAUTHORIZED = "Unauthorized access",
    FORBIDDEN = "Forbidden access",
    NOT_FOUND = "Resource not found",
    INTERNAL_SERVER_ERROR = "Internal server error",
    SERVICE_UNAVAILABLE = "Service unavailable",
    GATEWAY_TIMEOUT = "Gateway timeout",
    LOGIN_SUCCESS = "Login successful",
    UPDATION_SUCCESS = "data updated successfully",
    
    // Resignation messages
    RESIGNATION_CREATED_SUCCESS = "Resignation submitted successfully",
    RESIGNATION_UPDATED_SUCCESS = "Resignation updated successfully",
    RESIGNATION_DELETED_SUCCESS = "Resignation deleted successfully",
    RESIGNATION_APPROVED_SUCCESS = "Resignation approved successfully",
    RESIGNATION_REJECTED_SUCCESS = "Resignation rejected successfully",
    RESIGNATION_FETCHED_SUCCESS = "Resignation fetched successfully",
    RESIGNATIONS_FETCHED_SUCCESS = "Resignations fetched successfully",
    RESIGNATION_NOT_FOUND = "Resignation not found"
}