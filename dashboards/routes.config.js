const DashboardController = require('./controllers/dashboards.controller');

exports.routesConfig = function (app) {

    app.get('/getCurrentObservations', [       
        DashboardController.getCurrentObservations
    ]);

    app.get('/getTest', [       
        DashboardController.getTest
    ]);

};
