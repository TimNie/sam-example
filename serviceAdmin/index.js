let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        let pricipal = event.requestContext.authorizer.principalId;
        let permissionLevel = event.requestContext.authorizer.permissionLevel;
        if (permissionLevel < 10) {
            return {
                'statusCode': 403, // Forbidden
                'body': JSON.stringify({
                    message: 'Hello ' + pricipal + ' you are not allowed to see this resource.',
                    // location: ret.data.trim()
                })
            };
        }
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world from admin service ' + pricipal
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
