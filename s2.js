var textEl = document.getElementById("selectedTextContainer")
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

function loadText() {
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
