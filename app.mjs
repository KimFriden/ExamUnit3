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

function loadGames() {
    games = getAllGames();
    console.log(`Loaded ${games.length} games from localStorage`);
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

//#region testing if code actually works 
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
//#endregion
