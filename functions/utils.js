const getRandomItem = (arr) => arr[Math.floor(Math.random()*arr.length)];

const getRandomHeroShoot = (heroName, arr) => {
    let heroShoot = {};
    arr.forEach(hero => {
        if (hero.heroName === heroName) {
            console.log('hero', hero);
            heroShoot = getRandomItem(hero.heroShoots);
        }
    });
    return heroShoot;
};

module.exports = {
    getRandomItem,
    getRandomHeroShoot
};