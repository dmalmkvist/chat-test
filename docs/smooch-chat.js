
const SMOOCH_APP_ID = '5be0a05d88e4b900229d85f9';

var authenticate = function(cb) {
    $.ajax({
        url: 'http://localhost:8001/api/smooch/v1/authenticate',
        type: 'POST',
        contentType: 'application/json;  charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify({
            email: 'test@example.com',
            name: "Carl Sagan",
            loginDomain: "example.org",
            appId: SMOOCH_APP_ID
        }),
        success: function(response) {
            cb(response)
        },
        error: function() {
            console.log('auth failure');
        }
    })
}

var initSmooch = function(cb) {
    // To have our own UI
    Smooch.init({ appId: SMOOCH_APP_ID, embedded: true }).then(cb);

    // To use Smooch UI
    //Smooch.init({ appId: SMOOCH_APP_ID }).then(cb);
}

var loginToSmooch = function(userId, jwt, onSuccess, onError) {
    Smooch.login(userId, jwt)
    .then(onSuccess, onError);
}

var attachGladlyCustomerId = function(gladlyCustomerId) {
    Smooch.setDelegate({
        beforeSend: (message) => {
            message.metadata = {
                gladlyCustomerId: gladlyCustomerId
            };
            return message;
        }
    });
}

var sendMessage = function(gladlyCustomerId, message) {
    console.log('Sending message to: ' + gladlyCustomerId + ', msg: ' + message);
    Smooch.sendMessage({
        type: 'text',
        text: message
    })
}

startChat = function() {
    console.log("Starting chat");
    initSmooch(function() {
        console.log('Smooch initiated!')
        authenticate(function(authResponse) {
            console.log('authenticated with', authResponse);
            let userId = authResponse.userId;
            let gladlyCustomerId = authResponse.gladlyCustomerId;
            let jwt = authResponse.jwt;
            loginToSmooch(userId, jwt, function() {
                attachGladlyCustomerId(gladlyCustomerId);
                sendMessage(gladlyCustomerId, 'This is working great!');
                console.log("SUCCESS");
            }, function() {
                console.log("FAILURE :(");
            });
        })
    });

    // If this is not called then the Smooch.init() callback will not be called
    Smooch.render(document.getElementById('chat-container'));

}