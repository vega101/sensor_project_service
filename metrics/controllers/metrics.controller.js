const MetricModel = require('../models/metrics.model');

exports.insert = async (req, res) => {  
    const data = await MetricModel.createMetric(req.body)
    res.status(201).send(data) ;
};

exports.list = (req, res) => {  
    let pageSize = req.query.pageSize && req.query.pageSize <= 100 ? parseInt(req.query.pageSize) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    MetricModel.list(pageSize, page)
        .then((result) => {
            res.status(200).send(result);
        })
};


