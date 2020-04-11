var config = {
    Code: {
        OK: 200,
        FAIL: 500
    },
    STATUS: {
        OPEN: 1000,
        RESOLVED: 1001,
        IGNORE: 1002
    },
    LOGS: {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
    },
    ERROR_MSG: {
        INVALID_ID: 'Unauthorized access.',
        GENERIC_ERROR: 'Server error, refresh your browser.',
        CREATE_APP: 'Failed to create app',
        GENERATE_KEY:'Failed to generate key',
        COUNTRY_NOT_FOUND:'Country not found'
    },
    CORS_OPTIONS: { 
        origin:true, 
        optionsSuccessStatus:200,
        methods:["GET","HEAD","POST"],
        credentials: true 
    }
};

module.exports = config;