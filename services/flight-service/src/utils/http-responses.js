const unwrapError = (error) => {
    let current = error;
    const visited = new Set();

    while(current?.error && !visited.has(current)) {
        visited.add(current);
        current = current.error;
    }

    return current || error;
};

const createHttpError = (statusCode, message, details = message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    return error;
};

const sendSuccess = (res, statusCode, data, message) => {
    return res.status(statusCode).json({
        data,
        success: true,
        message,
        err: {}
    });
};

const sendError = (res, error, fallbackMessage) => {
    const normalized = unwrapError(error);
    let statusCode = normalized?.statusCode || 500;
    let message = normalized?.message || fallbackMessage;
    let details = normalized?.details || normalized?.explanation || message;

    if(normalized?.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Request validation failed';
        details = normalized.errors?.map((item) => item.message) || details;
    }
    if(normalized?.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Resource already exists';
        details = normalized.errors?.map((item) => item.message) || details;
    }
    if(normalized?.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 409;
        message = 'Resource is still in use';
        details = 'Remove dependent records before deleting this resource';
    }
    if(statusCode >= 500) {
        message = fallbackMessage;
        details = 'An unexpected server error occurred';
    }

    return res.status(statusCode).json({
        data: {},
        success: false,
        message,
        err: {
            code: statusCode,
            details
        }
    });
};

module.exports = {
    createHttpError,
    sendError,
    sendSuccess,
    unwrapError
};
