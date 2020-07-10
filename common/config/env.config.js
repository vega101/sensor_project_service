module.exports = {
    "port": 80, //3600
    "appEndpoint": "http://0.0.0.0:80", //http://localhost:3600
    "apiEndpoint": "http://0.0.0.0:80", //http://localhost:3600
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    }
};
