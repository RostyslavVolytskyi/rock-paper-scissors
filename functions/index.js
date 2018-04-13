'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

const {imagesInfo} = require('./config');
const {fallbackPhrases} = require('./config');
const {getRandomItem} = require('./utils');
const {getRandomHeroShoot} = require('./utils');

const WELCOME_INTENT = 'input.welcome';
const USERNAME_ACTION = 'user.name';
const DEFAULT_FALLBACK = 'input.unknown';
const NO_INPUT_EVENT = 'no.input';
const HERO_SELECTION = 'hero.touch';
const CANCEL_EVENT = 'say.bye';
const USER_SHOOT_EVENT = 'user.shoot';

const USER_NAME_CONTEXT = 'username_context';
const USERNAME_ARGUMENT = 'given-name';
const HERONAME_ARGUMENT = 'Hero';
const USER_SHOOT_ARGUMENT = 'UserShoot';

let heroName;

// TODO: add surface capabilities(do you have screen?)

exports.rockPaperScissors = functions.https.onRequest((request, response) => {
    const app = new App({request, response});
    // app.data.fallbackCount = 0;
    // console.log('Request headers: ' + JSON.stringify(request.headers));
    // console.log('Request body: ' + JSON.stringify(request.body));


    function welcomeIntentQuestion (app) {
        app.ask(`Hi Stranger. You've made great choice. My heroes are waiting to play with You! You will play up to three wins. But first they want to know: what is Your name?`,
            ['I didn\'t hear a name', 'If you\'re still there, what\'s your lucky number?',
                'We can stop here. Let\'s play again soon. Bye!']);
    }

    function createName (app) {
        const username = app.getArgument(USERNAME_ARGUMENT);

        const parameters = {};
        parameters[USERNAME_ARGUMENT] = username;
        app.setContext(USER_NAME_CONTEXT, 100, parameters);

        app.askWithCarousel(app.buildRichResponse()
            .addSimpleResponse(`Ok, ${username}, now choose with whom You want to play. Cosmic Bug and Fluffy Worm are waiting for You. Play carefully with them, they are very cunning!`)
            .addSuggestions([imagesInfo[0].heroName, imagesInfo[1].heroName]),
            app.buildCarousel()
                .addItems(app.buildOptionItem(imagesInfo[0].heroName,
                    ['cosmic', 'bug', 'buggy', 'cosmic bug'])
                    .setTitle(imagesInfo[0].heroName)
                    .setImage(imagesInfo[0].url, imagesInfo[0].heroName))
                .addItems(app.buildOptionItem(imagesInfo[1].heroName,
                    ['fluffy', 'worm', 'fluffy worm'])
                    .setTitle(imagesInfo[1].heroName)
                    .setImage(imagesInfo[1].url, imagesInfo[1].heroName)
                )
            );
    }

    function heroSelection (app) {
        let username;

        // from context
        if (app.getContextArgument(USER_NAME_CONTEXT, USERNAME_ARGUMENT)) {
            username = app.getContextArgument(USER_NAME_CONTEXT, USERNAME_ARGUMENT).value;
        }

        heroName = app.getSelectedOption();

        if (!heroName) {
            // from user
            heroName = app.getArgument(HERONAME_ARGUMENT);
        }

        if (heroName === 'Cosmic Bug' && username) {
            app.ask(`Aha, ${username}, this is ${heroName}. Let's see who has sharper mind! I trained a lot! So, what is your shoot?`);
        }

        if (heroName === 'Fluffy Worm' && username) {
            app.ask(`Hi ${username}, this is ${heroName}. Lets play with you. So, what is your shoot?`);
        }

        if (!heroName) {
            app.ask('You did not select any hero from the list or carousel');
        } else {
            app.ask('You selected an unknown item from the list or carousel');
        }

    }

    function userShoot() {
        let userShoot = app.getArgument(USER_SHOOT_ARGUMENT); // if stone - will be rock

        const heroShoot = getRandomHeroShoot(heroName, imagesInfo);
        const response = `Your shoot is ${userShoot} against ${heroName}'s ${heroShoot.text}`;

        app.ask(app.buildRichResponse()
            // Create a basic card and add it to the rich response
                .addSimpleResponse(response)
                .addBasicCard(app.buildBasicCard()
                    .setTitle(`${heroName}'s shoot: ${heroShoot.text}`)
                    .setImage(heroShoot.imageUrl, heroShoot.text)
                    // .setImageDisplay('CROPPED')
                )
        );
    }

    function noInput (app) {
        if (app.getRepromptCount() === 0) {
            app.ask(`What was that?`);
        } else if (app.getRepromptCount() === 1) {
            app.ask(`Sorry I didn't catch that. Could you repeat yourself?`);
        } else if (app.isFinalReprompt()) {
            app.tell(`Okay let's try this again later.`);
        }
    }

    function defaultFallback (app) {
        // console.log('!defaultFallback data-------->', app.data);
        // console.log('app.getRepromptCount()', app.getRepromptCount());
        // app.data.fallbackCount++;

        app.ask(getRandomItem(fallbackPhrases));

        if (app.data.fallbackCount === 2) {
            app.tell('Hmm, since I\'m still having trouble, so I\'ll stop here. Let’s play again soon.');
        }
    }

    function sayBye (app) {
        app.tell(`Okay, let's try this again later. You have some time for training. Heroes are waiting for you.`);
    }


    let actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntentQuestion);
    actionMap.set(USERNAME_ACTION, createName);
    actionMap.set(HERO_SELECTION, heroSelection);
    actionMap.set(USER_SHOOT_EVENT, userShoot);

    actionMap.set(DEFAULT_FALLBACK, defaultFallback);
    actionMap.set(NO_INPUT_EVENT, noInput);
    actionMap.set(CANCEL_EVENT, sayBye);

    app.handleRequest(actionMap);
});

