var textEl = document.getElementById("selectedTextContainer")
let audio = document.getElementById("audio")
let audioState = false
let playButton = document.getElementById("playButton")
let init = false

let fragments
let currentFragmentIndex
audio.muted = false

function selectText(n) {
    const fields = document.getElementById("textFields").children
    currentFragmentIndex = n
    audio.currentTime = fragments[currentFragmentIndex].timeBegin

    for (let c = 0; c < fields.length; c++) {
        let e = fields[c]
        if (c !== n) {
            e.classList.remove("selected")
        } else {
            e.classList.add("selected")
            textEl.textContent = e.textContent
        }
    }
}

function toggleMuteAudio() {
    if (audio.muted) {
        audio.volume = 1.0
    } else {
        audio.volume = 0.0
    }
    document.getElementById("volumeButton").classList.toggle("muted")
    audio.muted = !audio.muted
}

function progressLoop() {
    let progress = document.getElementById("audioProgress")
    let now = audio.currentTime
    let end = audio.duration

    // console.log(now / end * 100)

    progress.style.width = (now / end * 100) + "%"

    setTimeout(progressLoop, 100)
}

function next() {
    if (currentFragmentIndex < fragments.length - 1) {
        selectText(++currentFragmentIndex)
    }
}

function hardNext() {
    if (currentFragmentIndex < fragments.length - 1) {
        selectText(++currentFragmentIndex)
    } else {
        selectText(0)
    }
}

function previous() {
    if (0 < currentFragmentIndex) {
        selectText(--currentFragmentIndex)
    }
}

function hardPrevious() {
    if (0 < currentFragmentIndex) {
        selectText(--currentFragmentIndex)
    } else {
        selectText(fragments.length - 1)
    }
}


function mark() {
    if (currentFragmentIndex === undefined) return
    let ps = document.getElementById("textFields").children
    ps[currentFragmentIndex].classList.remove('accepted')
    ps[currentFragmentIndex].classList.add('marked')
}

function accept() {
    if (currentFragmentIndex === undefined) return
    let ps = document.getElementById("textFields").children
    ps[currentFragmentIndex].classList.remove('marked')
    ps[currentFragmentIndex].classList.add('accepted')
}

function playPause() {
    if (!init) {
        progressLoop()
    }
    if (audioState) {
        audio.pause()
        playButton.style.zIndex = '1'
    } else {
        audio.play()
        playButton.style.zIndex = '-1'
    }
    audioState = !audioState
}

function setTime(time) {
    audio.currentTime = time
}

async function loadText() {
    fragments = []
    await fetch("fragments.json")
        .then((res) => {
            return res.json();
        }).then((data) => {
            data.forEach((f) => {
                if (f.timeBegin < f.timeEnd) {
                    fragments.push(f)
                }
            })
        })
    audio.src = fragments[0].url
    const fields = document.getElementById("textFields")
    fields.innerHTML=""
    for (let i = 0; i < fragments.length; i++) {
        let p = document.createElement("p")
        p.innerText = fragments[i]['text']
        p.classList.add("text")
        p.onclick=() => {
            selectText(i)
            setTime(fragments[i]['timeBegin'])
        }
        fields.appendChild(p)
    }
}
