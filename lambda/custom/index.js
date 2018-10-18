const Alexa = require('alexa-sdk');
const config = require('./config');

/**
 * We import handlers as they are separated in different files
 */
const startAppHandler = require('./handlers/StartAppHandler');

const newSessionHandlers = {
    LaunchRequest: function () {
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Welcome');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = config.APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = config.languageString;
    alexa.registerHandlers(
        newSessionHandlers,
        startAppHandler
    );
    alexa.execute();
};