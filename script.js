const main = document.querySelector("main");
const input = document.getElementById("NotesInput")
const addBtn = document.getElementById("addBtn");


addBtn.addEventListener("click", renderNotes);


function renderNotes() {
    const top = Math.random() * 90;
    const left = Math.random() * 90;
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const notesInput = input.value.trim();
    const div = document.createElement("div");
    div.setAttribute("class", "notes");
    div.innerHTML = `${notesInput}`;
    div.style.backgroundColor = `rgb(${r},${g},${b})`;
    div.style.top = `${top + "%"}`;
    div.style.left = `${left + "%"}`;
    main.appendChild(div);
}