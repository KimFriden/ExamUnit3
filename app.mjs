import Game from './models/Game.mjs';

let games = [];

function saveGame(game) {

    const key = `game_${game.title.toLowerCase().replace(/\s+/g, '_')}`;
    localStorage.setItem(key, JSON.stringify(game));
    return key;
}

function getAllGames() {
    const games = [];

        for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

                if (key.startsWith('game_')) {
            try {
                const gameData = JSON.parse(localStorage.getItem(key));
                                const game = new Game(gameData);
                games.push(game);
            } catch (error) {
                console.error(`Error for key: ${key}:`, error);
            }
        }
    }

    return games;
}

function exportGamesAsJSON() {
    const games = getAllGames();
    return JSON.stringify(games, null, 2); }

function importGamesFromJSON(jsonString) {
    try {
        const gamesData = JSON.parse(jsonString);

                if (!Array.isArray(gamesData)) {
            throw new Error('JSON not an array of games');
        }

                const savedKeys = gamesData.map(gameData => {
            const game = new Game(gameData);
            return saveGame(game);
        });

        return {
            success: true,
            message: `Imported ${savedKeys.length} games successfully`,
            keys: savedKeys
        };
    } catch (error) {
        return {
            success: false,
            message: `Import went wrong: ${error.message}`
        };
    }
}

function renderGameRecord(game) {
    const gameElement = document.createElement('div');
    gameElement.className = 'game-record';
    gameElement.dataset.title = game.title;

    gameElement.innerHTML = `
        <div class="game-header">
            <h2>${game.title}</h2>
            <div class="game-meta">
                <span>${game.year}</span>
                <span>⏱️ ${game.time}</span>
                <span>👥 ${game.players}</span>
                <span>📊 ${game.difficulty}</span>
            </div>
        </div>
        <div class="game-info">
            <div class="game-creators">
                <p><strong>Designer:</strong> ${game.designer}</p>
                <p><strong>Artist:</strong> ${game.artist}</p>
                <p><strong>Publisher:</strong> ${game.publisher}</p>
            </div>
            <div class="game-stats">
                <p><strong>Plays:</strong> <span class="play-count">${game.playCount}</span></p>
                <div class="rating-container">
                    <label for="rating-${game.title.toLowerCase().replace(/\s+/g, '-')}">Rating:</label>
                    <input
                        type="range"
                        id="rating-${game.title.toLowerCase().replace(/\s+/g, '-')}"
                        min="0"
                        max="10"
                        value="${game.personalRating}"
                        class="rating-slider"
                        data-title="${game.title}">
                    <span class="rating-value">${game.personalRating}</span>
                </div>
                <button class="play-button" data-title="${game.title}">Record Play</button>
                <p><a href="${game.url}" target="_blank">View on BoardGameGeek</a></p>
            </div>
        </div>
    `;

    const ratingSlider = gameElement.querySelector('.rating-slider');
    ratingSlider.addEventListener('input', handleRatingChange);

    const playButton = gameElement.querySelector('.play-button');
    playButton.addEventListener('click', handlePlayRecord);

    return gameElement;
}

function updateGame(gameTitle, updates) {
        const gameIndex = games.findIndex(g => g.title === gameTitle);

    if (gameIndex === -1) {
        console.error(`Game "${gameTitle}" not found`);
        return false;
    }

    const updatedGame = { ...games[gameIndex], ...updates };
    games[gameIndex] = updatedGame;

        const key = `game_${gameTitle.toLowerCase().replace(/\s+/g, '_')}`;
    localStorage.setItem(key, JSON.stringify(updatedGame));

    return updatedGame;
}

function handleRatingChange(event) {
    const gameTitle = event.target.dataset.title;
    const newRating = parseInt(event.target.value);

    const updatedGame = updateGame(gameTitle, { personalRating: newRating });

    if (updatedGame) {
                const ratingValueDisplay = event.target.nextElementSibling;
        ratingValueDisplay.textContent = newRating;
    }
}

function handlePlayRecord(event) {
    const gameTitle = event.target.dataset.title;

    const game = games.find(g => g.title === gameTitle);

    if (!game) {
        console.error(`Game "${gameTitle}" not found`);
        return;
    }

    const newPlayCount = game.playCount + 1;
    const updatedGame = updateGame(gameTitle, { playCount: newPlayCount });

    if (updatedGame) {
                const gameElement = event.target.closest('.game-record');
        const playCountElement = gameElement.querySelector('.play-count');
        playCountElement.textContent = newPlayCount;
    }
}

function displayGames() {
    let gamesContainer = document.getElementById('games-container');

    if (!gamesContainer) {
        gamesContainer = document.createElement('div');
        gamesContainer.id = 'games-container';
        document.body.appendChild(gamesContainer);
    }

    gamesContainer.innerHTML = '';

    games.forEach(game => {
        const gameElement = renderGameRecord(game);
        gamesContainer.appendChild(gameElement);
    });
}

function loadGames() {
    games = getAllGames();
    console.log(`Loaded ${games.length} games from localStorage`);
    displayGames();
}

function setupFileImport() {
    const importInput = document.getElementById('importSource');

    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonData = e.target.result;
                const result = importGamesFromJSON(jsonData);

                if (result.success) {
                    loadGames();
                    console.log(result.message);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error('Error processing file:', error);
            }
        };

        reader.readAsText(file);
    });
}

function init() {
    loadGames();
    setupFileImport();
}

document.addEventListener('DOMContentLoaded', init);

export {
    saveGame,
    getAllGames,
    exportGamesAsJSON,
    importGamesFromJSON,
    games
};

/*
function testLocalStorageFunctions() {
    console.log("Testing localStorage...");

        clearGameStorage();
    console.log("Cleared localStorage...");

        const game1 = new Game({
        title: "Concordia",
        designer: "Mac Gerdts",
        year: 2013,
        playCount: 44,
        personalRating: 9
    });

    const game2 = new Game({
        title: "Terraforming Mars",
        designer: "Jacob Fryxelius",
        year: 2016,
        playCount: 136,
        personalRating: 8
    });

        console.log("Saving to localStorage...");
    const key1 = saveGame(game1);
    const key2 = saveGame(game2);
    console.log(`Saved games with keys: ${key1}, ${key2}`);

        console.log("Retrieving from localStorage...");
    const retrievedGames = getAllGames();
    console.log("Retrieved games:", retrievedGames);

        console.log("Exporting as JSON...");
    const jsonExport = exportGamesAsJSON();
    console.log("Exported JSON:", jsonExport);

        console.log("Clearing localStorage...");
    clearGameStorage();

        console.log("Importing from JSON...");
    const importResult = importGamesFromJSON(jsonExport);
    console.log("Import result:", importResult);

        console.log("Verifying imported games...");
    const gamesAfterImport = getAllGames();
    console.log("Games after import:", gamesAfterImport);

    console.log("Test complete!");
}


function clearGameStorage() {
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('game_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
}

window.addEventListener('DOMContentLoaded', testLocalStorageFunctions); 

export {
    saveGame,
    getAllGames,
    exportGamesAsJSON,
    importGamesFromJSON
};
*/
