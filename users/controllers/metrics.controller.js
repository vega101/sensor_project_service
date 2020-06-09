const MetricModel = require('../models/metrics.model');

exports.insert = async (req, res) => {  
    //res.send('hello 4');
    const data = await MetricModel.createMetric(req.body)

    res.status(201).send(data) ;

        // .then((result) => {
        //     res.status(201).send({id: 'success!'});//{id: result._id}
        // });
};

