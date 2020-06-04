const MetricModel = require('../models/metrics.model');

exports.insert = (req, res) => {  
    //res.send('hello 4');
    MetricModel.createMetric(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

