

var authenticate = function(cb) {
    $.ajax({
        url: 'http://localhost:8001/api/smooch/v1/authenticate',
        type: 'POST',
        contentType: 'application/json;  charset=UTF-8',
        dataType: 'json',
        data: {
            email: 'test@example.com',
            name: "Carl Sagan",
            loginDomain: "example.org"
        },
        success: function(response) {
            console.log(response);
        },
        error: function() {
            console.log('auth failure');
        }
    })
}

var initSmooch = function(cb) {
    // To have our own UI
    // Smooch.init({ appId: '5be0a05d88e4b900229d85f9', embedded: true }).then(cb);
    Smooch.init({ appId: '5be0a05d88e4b900229d85f9' }).then(cb);
}

var loginToSmooch = function(userId, jwt, onSuccess, onError) {
    Smooch.login(userId, jwt)
    .then(onSuccess, onError);
}

startChat = function() {
    console.log("Starting chat");
    initSmooch(function() {
        authenticate(function(userId, jwt) {
            loginToSmooch(userId, jwt, function() {
                console.log("SUCCESS")
            }, function() {
                console.log("FAILURE :(")
            });
        })
    });

}