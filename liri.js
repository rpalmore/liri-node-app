var keys = require("./keys.js");

var Twitter = require("twitter");

var client = new Twitter(keys.twitterKeys);

var input = process.argv[2];
var title = process.argv[3];


if (input === "my-tweets") {
    getTweets();
} else if (input === "spotify-this-song") {
    getSong();
} else if (input === "movie-this") {
    getMovie();
} else if (input === "do-what-it-says") {
    getRandom();
}

function getTweets() {
    client.get("statuses/user_timeline", function(error, body, response) {
        if (!error) {
            console.log("======================================");
            console.log("///////// REBECCA BE TWEETIN /////////");
            console.log("======================================");
            for (var i = 0; i < 20; i++) {
                console.log("Created on " + body[i].created_at.slice(0, 19));
                console.log(body[i].text);
                console.log("======================================");
            }
        }
    })
}

function getSong() {
    var spotify = require('spotify');
    spotify.search({ type: 'track', query: title }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
            // Adding some validation to user input 
        } else if (title && data.tracks.items[1] !== undefined) {
            console.log("=====================================");
            console.log("///////// SPOTIFY THIS SONG /////////");
            console.log("=====================================");
            console.log("The artist(s): " + data.tracks.items[1].artists[0].name);
            console.log("The song's name: " + data.tracks.items[1].name);
            console.log("Song preview link: " + data.tracks.items[1].preview_url);
            console.log("Album: " + data.tracks.items[1].album.name);
            console.log("=====================================");
            // Program will recognize if Spotify reads song title as "undefined"
        } else if (data.tracks.items[1] == undefined) {
            console.log("=====================================");
            console.log("/////// HMM, IS THAT A SONG? ////////");
            console.log("=====================================");
        } else if (!title) {
            // Using a different API call to ensure correct song is returned    
            spotify.lookup({ type: 'track', id: '3DYVWvPh3kGwPasp7yjahc' }, function(err, data) {
                console.log("=====================================");
                console.log("//////// REMEMBER THIS ONE? /////////");
                console.log("=====================================");
                console.log("The artist(s): " + data.album.artists[0].name);
                console.log("The song's name: " + data.name);
                console.log("Song preview link: " + data.preview_url);
                console.log("Album: " + data.album.name);
                console.log("=====================================");
            })
        }
    })
}


function getMovie() {
    var request = require('request');
    if (title) {
        var queryUrl = "http://www.omdbapi.com/?t=" + title + "&tomatoes=true";
    } else {
        queryUrl = "http://www.omdbapi.com/?t=mr+nobody&tomatoes=true"
    }
    request(queryUrl, function(error, response, body) {
        if (error) {
            console.log('error:', error);
        } else {
            function printMovie() {
                console.log("Everything you need to know about " + JSON.parse(body).Title + ":");
                console.log(JSON.parse(body).Title + " was released on " + JSON.parse(body).Released + " and stars actors " + JSON.parse(body).Actors + ".");
                console.log("Here's a short summary of " + JSON.parse(body).Title + ": " + JSON.parse(body).Plot);
                console.log("IMDB gives " + JSON.parse(body).Title + " a rating of " + JSON.parse(body).imdbRating + "; " + JSON.parse(body).Ratings[1].Source + " has it at " + JSON.parse(body).Ratings[1].Value + ".");
                console.log("Read the full " + JSON.parse(body).Ratings[1].Source + " review here: " + JSON.parse(body).tomatoURL);
                console.log(JSON.parse(body).Title + " was produced in " + JSON.parse(body).Country + " and is a " + JSON.parse(body).Language + "-language movie. ");
                console.log("=====================================");
            }
        }
        // Adding same type of validation here
        if (title && JSON.parse(body).Title !== undefined) {
            console.log("=====================================");
            console.log("////// THE OPEN MOVIE DATABASE //////");
            console.log("=====================================");
            printMovie();
        } else if (JSON.parse(body).Title == undefined) {
            console.log("=====================================");
            console.log("/// SORRY, THAT'S NOT A MOVIE ... ///");
            console.log("=====================================");
        } else {
            console.log("=====================================");
            console.log("//////// MAY WE RECOMMEND ... ///////");
            console.log("=====================================");
            printMovie();
        }
    })
}
// Redefining input and title based on contents of random.txt
function getRandom() {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function(error, data) {
        input = data.substring(0, 17);
        title = data.substring(18, 38);
        getSong();
    });
}

//////// BONUS //////// 

// Not sure how to capture all data printing to terminal, so only
// capturing input and title in log.txt.

var fs = require("fs");

var data = input + ", ";
if (title) {
    data = input + " " + title + "; "
}

fs.appendFile("log.txt", data, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Content Added!");
    }

});
