export default class Game {
    constructor({
        title = "",
        designer = "",
        artist = "",
        publisher = "",
        year = null,
        players = "",
        time = "",
        difficulty = "",
        url = "",
        playCount = 0,
        personalRating = 0
    } = {}) {
        this.title = title;
        this.designer = designer;
        this.artist = artist;
        this.publisher = publisher;
        this.year = year;
        this.players = players;
        this.time = time;
        this.difficulty = difficulty;
        this.url = url;
        this.playCount = playCount;
        this.personalRating = personalRating;
    }
}
