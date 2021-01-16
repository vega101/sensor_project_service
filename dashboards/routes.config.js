const DashboardController = require('./controllers/dashboards.controller');

exports.routesConfig = function (app) {

    app.get('/getCurrentObservations', [       
        DashboardController.getCurrentObservations
    ]);

};
