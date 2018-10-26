const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

const startAppHandler = Alexa.CreateStateHandler(config.APP_STATES.START, {
    Welcome() {        
        this.attributes.speechOutput = this.t('WELCOME_APP_MESSAGE', this.t('APP_NAME'));
        this.attributes.speechOutput += this.t('WELCOME_MESSAGE');
        this.emitWithState('Menu');
    },
    Menu() {
        const alexa = this;
        let speechOutput = this.attributes.speechOutput;
        this.attributes.speechOutput = '';
        speechOutput += this.t('REGISTER_PACKAGE');
        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {
                if (session.packages) {
                    speechOutput += this.t('RETRIEVE_INFO_PACKAGE');
                    speechOutput += this.t('DELETE_PACKAGE');
                }
                DB.save(alexa.event.context.System.user.userId, session).then(() => {
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, this.t('OPTIONS_MESSAGE'));
                });
            })
            .catch(err => {
                console.log(err);
            });
    },
    RegisterPackage() {
        this.handler.state = config.APP_STATES.REGISTER_PACKAGE;
        this.emitWithState('Init');
    },
    FindPackage() {
        this.handler.state = config.APP_STATES.FIND_PACKAGE;
        this.emitWithState('FindPackage');
    },
    PricePackage() {
        this.handler.state = config.APP_STATES.PRICE_PACKAGE;
        this.emitWithState('PricePackage');
    },
    DeletePackage() {
        this.handler.state = config.APP_STATES.DELETE_PACKAGE;
        this.emitWithState('Init');
    },
    FindPostingService() {
        this.handler.state = config.APP_STATES.FIND_POSTING_SERVICE;
        this.emitWithState('Init');
    },
    'AMAZON.RepeatIntent': function RepeatOption() {
        this.attributes.speechOutput = 'Je suis passé dans le repète intent';
        this.emitWithState('Menu');
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')));
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = SentenceHelper.getSentence(this.t('STOP_MESSAGE'));
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
});

module.exports = startAppHandler;