document.getElementById('startButton').addEventListener('click', function() {
    const editRewardsList = document.getElementById('editRewardsList');
    const rewards = [];
    const winners = [];

    // Uzimamo uneta imena iz pop-up prozora
    for (let i = 0; i < editRewardsList.children.length; i++) {
        const rewardName = editRewardsList.children[i].children[0].value.trim(); // Nagrade
        const winnerName = editRewardsList.children[i].children[1].value.trim(); // Dodeljeni dobitnici

        // Ako je polje za nagradu prazno, preskoči dodavanje
        if (rewardName) {
            rewards.push(rewardName);
            winners.push(winnerName || null); // Dodaj null ako je ime prazno
        }
    }

    const operateriInput = document.getElementById('operateriInput').innerText.trim(); // Koristi innerText
    const operateri = operateriInput.split('\n').filter(name => name); // Uzimanje imena operatera

    // Očisti listu operatera da bi izbegli duplikate
    const uniqueOperateri = [...new Set(operateri)];

    // Animacija
    const animationDuration = 4000; // 4 sekunde
    const animationInterval = 100; // 100 milisekundi
    const displayDuration = 2000; // 2 sekunde za prikaz dobitnika
    let currentRewardIndex = 0; // Indeks trenutne nagrade
    const assignedWinners = []; // Lista dodeljenih dobitnika

    function startAnimation() {
        if (currentRewardIndex < rewards.length) {
            const matchedName = winners[currentRewardIndex]; // Uzimamo ime iz pop-up prozora

            // Ako je ime definisano, pokrećemo animaciju
            if (matchedName) {
                runAnimation(matchedName);
            } else {
                // Ako nije dodeljeno ime, pokrećemo animaciju sa random dobitnikom
                animateRandomWinner();
            }
        }
    }

    function runAnimation(matchedName) {
        let currentIndex = 0;
        const animation = setInterval(() => {
            if (currentIndex < uniqueOperateri.length) {
                document.getElementById('currentName').innerText = uniqueOperateri[currentIndex];
                currentIndex++;
            } else {
                currentIndex = 0; // Resetuj index da bi animacija bila besprekidna
            }
        }, animationInterval);

        // Dodeljujemo nagradu nakon animacije
        setTimeout(() => {
            clearInterval(animation);
            assignPrize(matchedName); // Dodeljujemo određeno ime
        }, animationDuration);
    }

    function animateRandomWinner() {
        let currentIndex = 0;
        const animation = setInterval(() => {
            if (currentIndex < uniqueOperateri.length) {
                document.getElementById('currentName').innerText = uniqueOperateri[currentIndex];
                currentIndex++;
            } else {
                currentIndex = 0; // Resetuj index da bi animacija bila besprekidna
            }
        }, animationInterval);

        // Dodeljujemo nagradu nakon 3 sekunde
        setTimeout(() => {
            clearInterval(animation);
            const randomWinner = getRandomWinner();
            if (randomWinner) {
                assignPrize(randomWinner);
            } else {
                // U slučaju da nema dostupnih dobitnika
                assignPrize(null);
            }
        }, 3000); // Dodeljujemo nagradu nakon 3 sekunde
    }

    function assignPrize(matchedName) {
        const winnerSpan = document.getElementById(`winner${currentRewardIndex + 1}`);

        // Dodeljujemo određeno ime
        if (matchedName) {
            winnerSpan.innerText = matchedName; // Dodeljujemo određeno ime
            assignedWinners.push(matchedName); // Dodajemo dobitnika u listu
            // Takođe prikazujemo u name picker-u
            document.getElementById('currentName').innerText = matchedName; 
        } else {
            winnerSpan.innerText = "Nema dodeljenog dobitnika"; // Ako se ime ne poklapa
        }

        // Pauza pre prelaska na sledeću nagradu
        setTimeout(() => {
            currentRewardIndex++;
            startAnimation(); // Pokrećemo sledeću animaciju
        }, displayDuration); // 2 sekunde pauze
    }

    function getRandomWinner() {
        // Filtriramo operatere da izbegnemo dobitnike koji su već osvojili nagradu
        const availableWinners = uniqueOperateri.filter(name => !assignedWinners.includes(name));

        // Ako nema dostupnih dobitnika, vraćamo null
        if (availableWinners.length === 0) {
            return null;
        }

        // Izvlačimo slučajnog dobitnika
        const randomIndex = Math.floor(Math.random() * availableWinners.length);
        return availableWinners[randomIndex];
    }

    startAnimation(); // Pokrećemo prvu animaciju
});

// Funkcija za otvaranje modala
function openModal() {
    document.getElementById("modal").style.display = "block";
}

// Funkcija za zatvaranje modala
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Dodavanje event listener-a za taster F9
document.addEventListener("keydown", function(event) {
    if (event.key === "F9") {
        openModal();
    }
});

// Dodavanje event listener-a za zatvaranje modala
document.getElementById("closeModal").addEventListener("click", closeModal);

// Dodavanje event listener-a za klik van modala
window.addEventListener("click", function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
});
function adjustFontSize() {
    const container = document.getElementById('operateriInput');
    const names = container.querySelectorAll('.name');
    const maxNames = 100; // Maksimalan broj imena koji bi trebalo da stane u box

    // Dimenzije okvira
    const containerHeight = container.offsetHeight;
    const containerWidth = container.offsetWidth;

    // Inicijalna veličina fonta
    let fontSize = 16; // Početna veličina fonta

    // Ako ima više imena nego što stane u okvir
    if (names.length > 0) {
        // Računaj faktor skaliranja u zavisnosti od broja imena
        const scaleFactor = Math.min(Math.sqrt(maxNames / names.length), 1); // Skaliranje prema broju imena
        fontSize *= scaleFactor; // Smanji font ako ima više imena
        fontSize = Math.max(fontSize, 8); // Ograniči minimalnu veličinu fonta na 8px
    }

    // Primeni izračunatu veličinu fonta na sva imena
    names.forEach(name => {
        name.style.fontSize = `${fontSize}px`;
    });
}

// Poziv funkcije nakon učitavanja imena
adjustFontSize();

// Takođe, prilagođavaj veličinu fonta prilikom promene veličine prozora
window.addEventListener('resize', adjustFontSize);
