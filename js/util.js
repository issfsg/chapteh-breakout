function css(element, style) {
    for (const property in style)
        element.style[property] = style[property];
}

function transform(element) {
    css(element, {
        left: `${obj.x}px`,
        bottom: `${obj.y}px`,
        transform: `rotate(${obj.theta}deg)`
    });
}

function getHighScore(name) {
    return localStorage.getItem(name) || 0
}

function updateHighScore(name, score) {
    let highScore = getHighScore(name);
    highScore = (highScore < score) ? score : highScore;
    localStorage.setItem(name, highScore);
}