const StationController = require('./controllers/stations.controller');

exports.routesConfig = function (app) {

    app.post('/createStation', [
        StationController.insert
    ]);

    app.get('/getStations', [       
        StationController.list
    ]);

    app.get('/getStationById', [       
        StationController.getStationById
    ]);

};
