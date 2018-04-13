'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

const {imagesInfo} = require('./config');
const {fallbackPhrases} = require('./config');
const {getRandomItem} = require('./utils');
const {getRandomHeroShoot} = require('./utils');
const {setScore} = require('./utils');
const {clearScore} = require('./utils');

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
let username;
let hasScreen;

exports.rockPaperScissors = functions.https.onRequest((request, response) => {
    const app = new App({request, response});
    hasScreen = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);

    // app.data.fallbackCount = 0;

    function welcomeIntentQuestion (app) {
        clearScore();
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
            .addSimpleResponse(`Ok ${username}, now choose with whom You want to play. Cosmic Bug and Fluffy Worm are waiting for You. Play carefully with them, they are very cunning!`)
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

            app.ask(app.buildRichResponse()
                .addSimpleResponse({
                    speech: `Aha, ${username}, this is ${heroName}. Let's see who has sharper mind! I trained a lot! So, what is your shoot?`,
                    displayText: `Aha, ${username}, this is ${heroName}. Let's see who has sharper mind! I trained a lot! So, what is your shoot?`
                })
                .addSuggestions(['rock', 'paper', 'scissors']));
        }

        if (heroName === 'Fluffy Worm' && username) {
            app.ask(app.buildRichResponse()
                .addSimpleResponse({
                    speech: `Hi ${username}, this is ${heroName}. Lets play with you. So, what is your shoot?`,
                    displayText: `Hi ${username}, this is ${heroName}. Lets play with you. So, what is your shoot?`
                })
                .addSuggestions(['rock', 'paper', 'scissors']));
        }

        if (!heroName) {
            app.ask('You did not select any hero from the list or carousel');
        } else {
            app.ask('You selected an unknown item from the list or carousel');
        }

    }

    function userShoot() {
        let response;
        const userShoot = app.getArgument(USER_SHOOT_ARGUMENT); // if stone - will be rock
        const heroShootObj = getRandomHeroShoot(heroName, imagesInfo);
        const heroShoot = heroShootObj.text;
        const score = setScore(userShoot, heroShoot);

        const createImage = () => {
            return app.buildRichResponse()
                .addSimpleResponse(response)
                .addBasicCard(app.buildBasicCard()
                    .setTitle(`${heroName}'s shoot: ${heroShoot}. Score: ${score.user}:${score.hero}`)
                    .setImage(heroShootObj.imageUrl, heroShoot));
        };

        if (userShoot === heroShoot) {

            response = `Draw! Your shoot is ${userShoot} the same as ${heroName}'s. Score is still ${score.user}:${score.hero}. Your next shoot!`;
            app.ask(createImage().addSuggestions(['rock', 'paper', 'scissors']));

        } else if (score.user === 3 || score.hero === 3) {

            let winner = score.user > score.hero? `${username}` : `${heroName}`;
            response = `Your shoot is ${userShoot} against ${heroName}'s ${heroShoot}. Score now is ${score.user}:${score.hero}. ${winner} is a winner. Do you want to play once again?`;
            app.ask(createImage().addSuggestions(['yes', 'no']));

        } else {

            response = `Your shoot is ${userShoot} against ${heroName}'s ${heroShoot}. Score now is ${score.user}:${score.hero}. Your next shoot!`;
            app.ask(createImage().addSuggestions(['rock', 'paper', 'scissors']));

        }
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
        app.tell(`Okay, let's try this again later.`);
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

