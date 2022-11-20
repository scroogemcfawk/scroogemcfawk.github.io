const A = ['\u00AA', 'A', 'А' /* cyrillic */, '4', '\u2206', '\u03B1'];
const B = ['B', 'Б', '8', '\u00DF'];
const Z = ['Z', 'З'];
const _ = ['>', '_'];

let IS_PLAYING = false;

let PATH = window.location.pathname.split('/').slice(0, -1).join('/');

let AUDIO = Array.from(document.getElementsByClassName("audio"));

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

function playBAZA() {
    AUDIO.random().play();
}

document.addEventListener('scroll', () => {
    let letters = document.getElementsByClassName("letter");
    for (let l = 0; l < letters.length; l++) {
        let scrollRule = window.scrollY / 10 - 50;
        if (scrollRule <= 150) {
            letters[l].style.margin = `${scrollRule}px`;
        }
    }
});

function randomize() {
    let letters = document.getElementsByClassName("letter");
    let flag = Math.round(Math.random() * 4);
    switch (flag) {
        case 0:
            document.getElementById("prompt").innerText = _.random();
            break;
        case 1:
            document.getElementById("b").innerText = B.random();
            break;
        case 2:
        case 4:
            document.getElementById(flag === 2 ? "a1" : "a2").innerText = A.random();
            break;
        case 3:
            document.getElementById("z").innerText = Z.random();
            break;
    }
    // let timeout = Math.round(100 + Math.round(Math.random() * 500));
    let timeout = 100;
    console.log(timeout)
    setTimeout(randomize, timeout);
}
randomize();

