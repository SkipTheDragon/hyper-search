export default function randomMessage() {
    const messages = [
        "Searching for aliens: Is it just like finding a needle in a cosmic haystack?",
        "Quest for space donuts: How to navigate the galaxy in search of the perfect treat?",
        "Hunting for lost tools in zero gravity: Where did my wrench float off to this time?",
        "Search party in space: Can we organize a rescue mission for that lost pen?",
        "In pursuit of the ultimate space playlist: Where to find the grooviest cosmic tunes?",
        "Hilarious space memes: Where to search for the best zero-gravity laughs?",
        "Lost in translation: How to decipher alien emojis in interstellar messages?",
        "Space treasure hunting: Seeking out rare meteorites for fun and profit?",
        "Space station hide and seek: Where's the best hiding spot in a place with no corners?",
        "Navigating the space-time continuum: Is there an app for that?",
        "Astronaut Tinder: Where to search for love in the cosmos?",
        "Space trivia night: Where to find the most obscure facts about the universe?",
        "Lost in space: How to find your way back to the space station after a spacewalk?",
        "Hunting for shooting stars: Where's the best spot on the spacecraft for stargazing?",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
}
