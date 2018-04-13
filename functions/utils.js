const getRandomItem = (arr) => arr[Math.floor(Math.random()*arr.length)];

const getRandomHeroShoot = (heroName, arr) => {
    let heroShoot = {};
    arr.forEach(hero => {
        if (hero.heroName === heroName) {
            heroShoot = getRandomItem(hero.heroShoots);
        }
    });
    return heroShoot;
};

const score = {
    user: 0,
    hero: 0
};

const setScore = (userShoot, heroShoot) => {
    if (userShoot === heroShoot) {
        return score;
    }
    if (userShoot === 'paper' && heroShoot === 'rock' ||
        userShoot === 'rock' && heroShoot === 'scissors' ||
        userShoot === 'scissors' && heroShoot === 'paper'
    ) {
        score.user++;
    } else {
        score.hero++;
    }
    return score;
};

const clearScore = () => {
    score.user = 0;
    score.hero = 0;
}

module.exports = {
    getRandomItem,
    getRandomHeroShoot,
    setScore,
    clearScore
};