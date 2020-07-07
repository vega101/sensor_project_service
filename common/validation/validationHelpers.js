
exports.validateSortObj = function (sortObj, gridSchema){
    if (sortObj && typeof sortObj === 'object') {
        let isValid = true;
        for (var prop in sortObj) {
            if (!gridSchema.indexOf(prop) === -1) {
                isValid = false;
                break;               
            } else {
                if (sortObj[prop] !== 1 || sortObj[prop] !== -1){
                    isValid = false;
                    break;  
                }
            }
        }
        
        return isValid;

    } else {
        return false;
    }
}

exports.validateQueryObj = function (filters, gridSchema) {
     
    if (Array.isArray(filters) && filters.length) {
        
        let isValid = true;
        for (f of filters){
            let isValidItem = validateQueryItem(f);
            if (!isValidItem){
                isValid = false;
                break;
            }
        }

        return isValid;

    } else {
        return false;
    }

    function validateQueryItem(fi){
        var isValid = false;
        if (Object.keys(fi).length === 1) {
            let prop = Object.keys(fi)[0];
            if (gridSchema.indexOf(prop) === 1) {
                isValid = true;               
            }
        } 
        return isValid;
    }
}

exports.validateRequestData = function (data, dataSchema){
    
    for (metric of data){
        metric.isValid = validateMetricItem(metric);
    }

    function validateMetricItem(item){
        if (Object.keys(item).length !== dataSchema.length) {
            return false;
        }

        let isValid = true;

        for (var prop of dataSchema){
            if (!item.hasOwnProperty(prop)){
                isValid = false;
                break;
            }
        }

        return isValid;
    }

}