/*
** Adapted from https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html#api-gateway-lambda-authorizer-request-lambda-function-create
** A simple REQUEST authorizer example to demonstrate how to use request parameters to allow or deny a request.
** In this example, a request is authorized if the client provided an `auth=admin` or 'auth=user' in the query string.
*/
exports.handler = async function (event) {
    const token = event.queryStringParameters.auth.toLowerCase();
    const methodArn = event.methodArn;

    /*
    ** headers, queryStringParameters, stageVariables, requestContext and more are available on the `event` object
    ** event.headers: A map/object containing HTTP request headers
    ** event.queryStringParameters: A map/object containing query strings supplied in the URL
    ** event.stageVariables: A map/object containing variables defined on the API Gateway Stage
    ** event.requestContext: A map/object containing additional request context
    */

    switch (token) {
        case 'admin':
            return generateAuthResponse('admin', 'Allow', methodArn);
        case 'user':
            return generateAuthResponse('user', 'Allow', methodArn);
        case 'deny':
            return generateAuthResponse('user', 'Deny', methodArn);
        default:
            return Promise.reject('Error: Invalid token'); // Returns 500 Internal Server Error
    }
};

function generateAuthResponse(principalId, effect, methodArn) {
    // If you need to provide additional information to your integration
    // endpoint (e.g. your Lambda Function), you can add it to `context`
    const permissionLevel = readPermissionLevel(principalId);
    const context = {
        'permissionLevel': permissionLevel
    };
    const policyDocument = generatePolicyDocument(effect, methodArn);

    return {
        principalId,
        context,
        policyDocument
    };
}

function readPermissionLevel(principalId) {
    // Simulate an authorization level used by the called functions to
    // provide content based on permission levels.
    switch (principalId) {
        case 'admin':
            return 10;
        case 'user':
            return 5;
        default:
            return 0;
    }
}

function generatePolicyDocument(effect, methodArn) {
    if (!effect || !methodArn) return null;

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
        }]
    };

    return policyDocument;
}