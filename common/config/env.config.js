module.exports = {
    "port": 80, //3600
    "appEndpoint": "http://ec2-3-128-213-177.us-east-2.compute.amazonaws.com:80", //http://localhost:3600
    "apiEndpoint": "http://ec2-3-128-213-177.us-east-2.compute.amazonaws.com:80", //http://localhost:3600
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    }
};
