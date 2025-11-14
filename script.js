document.addEventListener("DOMContentLoaded", () => {
    showTeam()
})
const main = document.querySelector("main");
const box = document.getElementById("card");

const changeBtn = document.getElementById("change")

const iplTeams = [
    {
        logo: "CSK",
        name: "Chennai Super Kings",
        yearFounded: 2008,
        trophies: 5,
        captain: "MS Dhoni",
        primaryColor: "#FFF100",
        secondaryColor: "black",
        link: "https://www.chennaisuperkings.com/"
    },
    {
        logo: "DC",
        name: "Delhi Capitals",
        yearFounded: 2008,
        trophies: 0,
        captain: "Axar Patel",
        primaryColor: "#0116CF",
        secondaryColor: "silver",
        link: "https://www.delhicapitals.in/"
    },
    {
        logo: "KKR",
        name: "Kolkata Knight Riders",
        yearFounded: 2008,
        trophies: 3,
        captain: "Ajinkya Rahane",
        primaryColor: "purple",
        secondaryColor: "gold",
        link: "https://www.kkr.in/"
    },
    {
        logo: "MI",
        name: "Mumbai Indians",
        yearFounded: 2008,
        trophies: 5,
        captain: "Hardik Pandya",
        primaryColor: "blue",
        secondaryColor: "gold",
        link: "https://www.mumbaiindians.com/"
    },
    {
        logo: "PBKS",
        name: "Punjab Kings",
        yearFounded: 2008,
        trophies: 0,
        captain: "Shreyas Iyer",
        primaryColor: "#ED1B24",
        secondaryColor: "silver",
        link: "https://www.punjabkingsipl.in/"
    },
    {
        logo: "RR",
        name: "Rajasthan Royals",
        yearFounded: 2008,
        trophies: 1,
        captain: "Sanju Samson",
        primaryColor: "#FC4CFC",
        secondaryColor: "black",
        link: "https://www.rajasthanroyals.com/"
    },
    {
        logo: "RCB",
        name: "Royal Challengers Bengaluru",
        yearFounded: 2008,
        trophies: 1,
        captain: "Rajat Patidar",
        primaryColor: "red",
        secondaryColor: "black",
        link: "https://www.royalchallengers.com/"
    },
    {
        logo: "SRH",
        name: "Sunrisers Hyderabad",
        yearFounded: 2013,
        trophies: 1,
        captain: "Pat Cummins",
        primaryColor: "orange",
        secondaryColor: "black",
        link: "https://www.sunrisershyderabad.in/"
    },
    {
        logo: "GT",
        name: "Gujarat Titans",
        yearFounded: 2022,
        trophies: 1,
        captain: "Shubman Gill",
        primaryColor: "#1B2133",
        secondaryColor: "silver",
        link: "https://www.gujarattitansipl.com/"
    },
    {
        logo: "LSG",
        name: "Lucknow Super Giants",
        yearFounded: 2022,
        trophies: 0,
        captain: "Rishabh Pant",
        primaryColor: "#0057E2",
        secondaryColor: "orange",
        link: "https://www.lucknowsupergiants.in"
    }
];


changeBtn.addEventListener("click", (e) => {
    e.preventDefault()
    showTeam()
})

function showTeam() {
    if (!box) return;
    const num = Math.floor(Math.random() * (iplTeams.length - 1)) + 1;
    const team = iplTeams[num];
    box.innerHTML = `
         <h1>${team.logo}</h1>
            <div style="margin-bottom: 15px;">
                <p>${team.name}</p>
                <p>Year Founded : <span>${team.yearFounded}</span></p>
                <p>Trophies : <span>${team.trophies}</span></p>
                <p>Captain : <span>${team.captain}</span></p>
            </div>
            <a href="${team.link}" class="btn" target="_blank">Learn more</a>
        `;
    box.style.backgroundColor = `${team.secondaryColor}`;
    main.style.backgroundColor = `${team.primaryColor}`;
}