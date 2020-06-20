const MetricsController = require('./controllers/metrics.controller');

exports.routesConfig = function (app) {

    app.post('/createMetric', [
        MetricsController.insert
    ]);

    app.get('/getMetrics', [       
        MetricsController.list
    ]);

    app.post('/hello', function (req, res) {
        res.send('hello');
    })

};
