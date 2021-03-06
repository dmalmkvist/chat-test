
const SMOOCH_APP_ID = '5c3e5a95e610000028c6dea3';

var authenticate = function(cb) {
    let authResponse = localStorage.getItem('sessionToken');
    if (authResponse) {
        cb(JSON.parse(authResponse));
        return;
    }
    
    $.ajax({
        url: 'http://localhost:8001/api/smooch/v1/authenticate',
        type: 'POST',
        contentType: 'application/json;  charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify({
            email: 'test@example.com',
            name: "Carl Sagan",
            loginDomain: "example.org",
            appId: SMOOCH_APP_ID,
            userId: 'user Id from cookie'
        }),
        success: function(response) {
            localStorage.setItem('sessionToken', JSON.stringify(response))
            cb(response)
        },
        error: function() {
            console.log('auth failure');
        }
    })
}

var initSmooch = function(cb) {
    // To have our own UI
    GladlyInc.init({ appId: SMOOCH_APP_ID, embedded: false }).then(cb);

    // To use Smooch UI
    //GladlyInc.init({ appId: SMOOCH_APP_ID }).then(cb);
}

var loginToSmooch = function(userId, jwt, onSuccess, onError) {
    GladlyInc.login(userId, jwt)
    .then(onSuccess, onError);
}

var attachGladlyCustomerId = function(gladlyCustomerId) {
    GladlyInc.setDelegate({
        beforeSend: (message) => {
            message.metadata = {
                gladlyCustomerId: gladlyCustomerId,
                subType: 'TEXT',
            };
            return message;
        }
    });
}

var sendMessage = function(gladlyCustomerId, message) {
    console.log('Sending message to: ' + gladlyCustomerId + ', msg: ' + message);
    GladlyInc.sendMessage({
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
                //sendMessage(gladlyCustomerId, 'This is working great!');
                console.log("SUCCESS");
            }, function() {
                console.log("FAILURE :(");
            });
        })
        //Smooch.on('typing:start', data => console.log('start', data))
        //Smooch.on('typing:stop', data => console.log('stop', data))
    });

    // If this is not called then the Smooch.init() callback will not be called
    //Smooch.render(document.getElementById('chat-container'));

}