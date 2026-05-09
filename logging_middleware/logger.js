const log = (level, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logPrefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data) {
        console.info(`${logPrefix} ${message}`, data);
    } else {
        console.info(`${logPrefix} ${message}`);
    }
    // In a real application, we might send this to an external service like Datadog or ELK.
};

module.exports = { log };
