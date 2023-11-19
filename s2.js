var textEl = document.getElementById("selectedTextContainer")
let audio = document.getElementById("audio")
let audioState = false
let playButton = document.getElementById("playButton")
let init = false

function selectText(n) {
    const fields = document.getElementById("textFields").children
    // console.log(textEl)
    // console.log(fields)
    for (let c = 0; c < fields.length; c++) {
        let e = fields[c]
        // console.log(e)
        if (c !== n) {
            e.classList.remove("selected")
        } else {
            e.classList.add("selected")
            textEl.textContent = e.textContent
        }
    }
}

function progressLoop() {
    let progress = document.getElementById("audioProgress")
    let now = audio.currentTime
    let end = audio.duration

    // console.log(now / end * 100)

    progress.style.width = (now / end * 100) + "%"

    setTimeout(progressLoop, 100)
}

function A() {
    console.log('A')
}

function B() {
    console.log('B')
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

function loadText() {
    audio.src = "recording.mp3"
    textEl.innerText = ""
    let ts = [
        "ОДНА ИЗ ВЕСЕЛЕЙШИХ СТОРОН СТУДЕНЧЕСКОЙ ЖИЗНИ -- ЭТО РАБОТА НАД ПРОЕКТАМИ ПО ПРОГРАММНОЙ ИНЖЕНЕРИИ.",
        "РАБОТОЙ ЭТОЙ ОНИ ЗАНИМАЮТСЯ ПРЯМ ОТ ДУШИ, НЕРЕДКО ПОЛАГАЯ, ЧТО ДЛЯ ЭТОГО И ИНЖЕНЕРИЯ-ТО НЕ НУЖНА, ЕСЛИ ТАК-ТО.",
        "ПРЕПОДАВАТЕЛИ К ТАКОЙ ТОЧКЕ ЗРЕНИЯ ОТНОСЯТСЯ С ПОНИМАНИЕМ, И САМИ ПОСТЕПЕННО НАЧИНАЮТ ДУМАТЬ, ЧТО ВОЗМОЖНО, СТУДЕНТЫ В ЭТОМ ВОПРОСЕ ПРАВЫ.",
        "НО ИЗ ГОДА В ГОД ОПЫТ ПОКАЗЫВАЕТ, ЧТО КОГДА ДЕЛО ДОХОДИТ ДО ЗАВЕРШЕНИЯ РАБОТЫ НАД ПРОЕКТОМ, ИНЖЕНЕРИЯ ТАКИ НУЖНА, В ЧЁМ УБЕЖДАЮТСЯ НЕ ТОЛЬКО СТУДЕНТЫ, НО И ПРЕПОДАВАТЕЛИ."
    ]
    const fields = document.getElementById("textFields")
    fields.innerHTML=""
    for (let i = 0; i < ts.length; i++) {
        let p = document.createElement("p")
        p.innerText = ts[i]
        p.classList.add("text")
        p.onclick=() => selectText(i)
        fields.appendChild(p)
    }
}
