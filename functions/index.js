'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');


// a. the action name from the make_name Dialogflow intent
const WELCOME_INTENT = 'input.welcome';  // the action name from the Dialogflow intent
const NAME_ACTION = 'create_name';

// b. the parameters that are parsed from the make_name intent
const NAME_ARGUMENT = 'given-name';


// TODO: add surface capabilities(do you have screen?)

exports.rockPaperScissors = functions.https.onRequest((request, response) => {
    const app = new App({request, response});
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));


    function welcomeIntentQuestion (app) {
        app.ask(`Hi User! What is your name?`,
            ['I didn\'t hear a number', 'If you\'re still there, what\'s your lucky number?',
                'We can stop here. Let\'s play again soon. Bye!']);
    }

    function createName (app) {
        let name = app.getArgument(NAME_ARGUMENT);

        app.ask(`Alright! Your super silly name is "${name}"! I hope you like it. Which kind of sport do you like to play?`);
    }


    let actionMap = new Map();

    actionMap.set(WELCOME_INTENT, welcomeIntentQuestion);
    actionMap.set(NAME_ACTION, createName);

    app.handleRequest(actionMap);
});
