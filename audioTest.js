const main = document.getElementById("main")
const exampleJsonPath = "api-example.json"
const testMode = true
const debugMode = true
const jsonLink = "https://marigostra.ru/persist/proj-player/fragments.json"

const PLAY_LABEL = "Play"
const STOP_LABEL = "Stop"

const audio = document.createElement("audio")
const fragmentLabel = document.createElement("label")
const fragmentText = document.createElement("div")
const br = document.createElement("br")
const prevButton = document.createElement("button")
const playStopButton = document.createElement("button")
const nextButton = document.createElement("button")

let jsonFragments

function log(msg) {
    if (debugMode) {
        console.log(msg)
    }
}

function initElements() {
    function initButton(button, id, innerText, disabled) {
        button.id = id
        button.innerText = innerText
        button.disabled = disabled
    }

    initButton(prevButton, "prevButton", "Prev", true)
    initButton(playStopButton, "playStopButton", PLAY_LABEL, false)
    initButton(nextButton, "nextButton", "Next", false)
    audio.id = "audio"
    fragmentLabel.id = "fragmentLabel"
    fragmentText.id = "fragmentText"
}

function setUpButtons() {
    const b = document.getElementById("loadFragmentsButton")
    b.remove()
    main.appendChild(fragmentLabel)
    main.appendChild(br)
    main.appendChild(prevButton)
    main.appendChild(playStopButton)
    main.appendChild(nextButton)
    main.appendChild(fragmentText)

    resolveLoadingFragments()
}

function resolveLoadingFragments() {
    if (testMode) {
        loadFragments(exampleJsonPath)
    } else {
        loadFragments(jsonLink)
    }
}

function loadFragments(source) {
    fetch(source)
        .then(res => res.json())
        .then(out => {
            jsonFragments = out
            setFragment(0)
        })
        .catch(err => {
            console.log("Error " + err)
        })
}

function setFragment(n) {
    if (jsonFragments.length <= 0) {
        console.log("Fragment set is empty")
        return
    }
    if (jsonFragments.length <= n) {
        console.log("Illegal fragment number parameter")
        return
    }
    fragmentLabel.innerText = (n + 1) + " / " + jsonFragments.length

    const fragment = jsonFragments[n]
    if (audio.src !== fragment.url) {
        audio.src = fragment.url
    }
    fragmentText.innerText = fragment.text
    playStopButton.innerText = PLAY_LABEL
    playStopButton.onclick = () => {
        playHandler(fragment.timeBegin, fragment.timeEnd)
    }
    if (n > 0) {
        prevButton.disabled = false
        prevButton.onclick = () => {
            if (!audio.paused) {
                audio.pause()
            }
            setFragment(n - 1)
        }
    } else {
        prevButton.disabled = true
    }
    if (n < jsonFragments.length - 1) {
        nextButton.disabled = false
        nextButton.onclick = () => {
            if (!audio.paused) {
                audio.pause()
            }
            setFragment(n + 1)
        }
    } else {
        nextButton.disabled = true
    }
}

function playHandler(a, b) {
    playStopButton.innerText = STOP_LABEL
    playStopButton.onclick = () => {
        stopHandler(a, b)
    }
    playAB(a, b)
}

function stopHandler(a, b) {
    if (!audio.paused) {
        audio.pause()
    }
    audio.currentTime = a
    playStopButton.innerText = PLAY_LABEL
    playStopButton.onclick = () => {
        playHandler(a, b)
    }
}
function playAB(a, b) {
    if (a > b) {
        log("Illegal function arguments")
        return
    }
    audio.currentTime = a
    audio.play()
    var duration = (b - a) * 1000
    log("Playing fragment: " + a.toFixed(2) + " - " + b.toFixed(2) +
        ".\nFragment duration: " + (duration / 1000).toFixed(2) + "s.")
    killWhenOverB(b, a)
}

function killWhenOverB(b, a) {
    // 200ms is enough for human reaction to not notice the difference imo
    setTimeout(function () {
        if (!audio.paused) {
            if (audio.currentTime > b) {
                audio.pause()
                audio.currentTime = a
                playStopButton.innerText = PLAY_LABEL
                playStopButton.onclick = () => {
                    playHandler(a, b)
                }
            } else {
                killWhenOverB(b, a)
            }
        }
    }, 200)
}