const LocationController = require('./controllers/locations.controller');

exports.routesConfig = function (app) {

    app.post('/createLocation', [
        LocationController.insert
    ]);

    app.get('/getLocations', [       
        LocationController.list
    ]);

    app.get('/getLocationById', [       
        LocationController.getLocationById
    ]);

};
