const imagesInfo = {
    hero1: { url: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/wait.png?alt=media&token=2816274a-e19d-4aca-8d21-b14fedb14813', heroName: 'Cosmic Bug', heroShoots: {
        rock: {
            text: 'rock',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/hero_shoots%2Frock.jpg?alt=media&token=4b9d38a1-13cb-492e-bd07-90d984622a39'
        },
        paper: {
            text: 'paper',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/hero_shoots%2Fpaper.jpg?alt=media&token=2b887911-c1b8-4730-8889-bd0775563fde'
        },
        scissors: {
            text: 'scissors',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/hero_shoots%2Fscissors.jpg?alt=media&token=670e2ec8-8f35-4b9a-b572-e3de09cabc98'
        }

    }},
    hero2: { url: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/rsz_minions.jpg?alt=media&token=afb4713b-3efc-439e-a61a-d47d0058b0a1', heroName: 'Fluffy Worm', heroShoots: {
        rock: {
            text: 'rock',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/hero_shoots%2Frock.jpg?alt=media&token=4b9d38a1-13cb-492e-bd07-90d984622a39'
        },
        paper: {
            text: 'paper',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/hero_shoots%2Fpaper.jpg?alt=media&token=2b887911-c1b8-4730-8889-bd0775563fde'
        },
        scissors: {
            text: 'scissors',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/rock-paper-scissors-d9968.appspot.com/o/hero_shoots%2Fscissors.jpg?alt=media&token=670e2ec8-8f35-4b9a-b572-e3de09cabc98'
        }
    }}
};

const fallbackPhrases = [
    `I missed what you said. Say it again?`,
    'Sorry, could you say that again?',
    'Can you say that again?',
    `Sorry, I didn't get that.`,
    'Sorry, what was that?',
    'One more time?',
    'What was that?',
    'Say that again?',
    `I didn't get that.`,
    'I missed that.'
];

module.exports = {
    imagesInfo,
    fallbackPhrases
};