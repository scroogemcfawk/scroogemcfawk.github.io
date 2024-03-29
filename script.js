var textEl = document.getElementById("selectedTextContainer")
let audio = document.getElementById("audio")
let audioState = false
let playButton = document.getElementById("playButton")
let init = false
let loadState = false
let timeout

let fragments
let currentFragmentIndex
audio.muted = false


function markText(n) {
    const fields = document.getElementById("textFields").children
    for (let c = 0; c < fields.length; ++c) {
        let e = fields[c]
        if (c !== n) {
            e.classList.remove("selected")
        } else {
            e.classList.add("selected")
            textEl.textContent = e.textContent
        }
    }
}

function textProgress() {
    if (loadState) {
        var curTime = audio.currentTime
        // yeah... it's n^2...
        for (let i = 0; i < fragments.length; ++i) {
            var check = fragments[i]
            if (check.timeBegin <= curTime && curTime <= check.timeEnd) {
                markText(i)
                return
            }
        }
    }
}

function selectText(n) {
    if (n > -1) {
        currentFragmentIndex = n
        audio.currentTime = fragments[currentFragmentIndex].timeBegin
        markText(n)
    }
}



function toggleMuteAudio() {
    var icon = document.getElementById("volumeButton").getElementsByTagName("i").item(0)
    if (audio.muted) {
        audio.volume = 1.0
        icon.classList.remove("fa-volume-xmark")
        icon.classList.add("fa-volume-high")
    } else {
        audio.volume = 0.0
        icon.classList.add("fa-volume-xmark")
        icon.classList.remove("fa-volume-high")
    }
    audio.muted = !audio.muted
}

function progressLoop() {
    let progress = document.getElementById("audioProgress")
    let now = audio.currentTime
    let end = audio.duration

    // console.log(now / end * 100)

    textProgress()

    progress.style.width = (now / end * 100) + "%"

    setTimeout(progressLoop, 100)
}

function next() {
    if (currentFragmentIndex < fragments.length - 1) {
        selectText(++currentFragmentIndex)
        autoFragment()
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
        autoFragment()
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

function autoFragment() {
    if (timeout !== undefined) {
        clearTimeout(timeout)
    }
    timeout = setTimeout(
        () => {
            if (currentFragmentIndex < fragments.length - 1) {
                playPause()
                // selectText(currentFragmentIndex + 1)
            } else {
                playPause()
            }
            // autoFragment()
        },
        (fragments[currentFragmentIndex]['timeEnd'] - fragments[currentFragmentIndex]['timeBegin']) * 1000
    )
}

function playPause() {
    if (!loadState) {
        let hint = document.getElementById("hint")
        console.log(hint)
        hint.classList.add("importantText")
        return
    }
    if (!init) {
        progressLoop()
    }
    if (audioState) {
        audio.pause()
        playButton.style.zIndex = '1'
        if (timeout !== undefined) {
            clearTimeout(timeout)
        }
    } else {
        // console.log("play")
        audio.play()
        playButton.style.zIndex = '-1'
        if (currentFragmentIndex > -1) {
            autoFragment()
        }
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
    loadState = true
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
    selectText(-1)
}
