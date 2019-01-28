
require("dotenv").config();

var fs = require('fs');
var axios = require('axios');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
var moment = require('moment');

var cmd = process.argv[2];
var searchTerm = process.argv[3];

switch (cmd) {

    case 'concert-this':
        findBands();
        break;

    case 'spotify-this-song':
        spotifySong();
        break;

    case 'movie-this':
        findMovie();
        break;

    case 'do-what-it-says':
        readRandom()
        break;

}


function findBands() {
    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
        .then(function (response) {
            var venueName = response.data[0].venue.name;
            var venueCountry = response.data[0].venue.country;
            var venueCity = response.data[0].venue.city;
            var showTime = moment(response.data[0].datetime).format("MM/DD/YYYY, h:mm:ss a");
            console.log('Venue: ' + venueName + '\nWhere: ' + venueCity + ', ' + venueCountry + '\nShowtime: ' + showTime);
            // console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function findMovie() {
    if(searchTerm === undefined){
        searchTerm = 'Mr. Nobody'
    }
    axios.get('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=' + searchTerm)
        .then(function (response) {
            var movieTitle = response.data.Title;
            var year = response.data.Year;
            var imdb = response.data.Ratings[0].Value;
            var rotten = response.data.Ratings[1].Value;
            var country = response.data.Country;
            var lang = response.data.Language;
            var plot = response.data.Plot;
            var actors = response.data.Actors;
            console.log(movieTitle + '\nReleased: ' + year + '\nIMDB Rating: ' + imdb + '\nRotten Tomatoes Rating: ' + rotten + '\nCountry: ' + country + '\nLanguage: ' + lang + '\nPlot: ' + plot + '\nActors: ' + actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function spotifySong() {
    if (searchTerm === undefined){
        searchTerm = 'the sign ace of base'
    }

    // searchTerm = searchTerm;
    spotify.search(
        {
            type: 'track',
            query: searchTerm
        }, function (err, data) {
            var artist = data.tracks.items[0].album.artists[0].name;
            var songTitle = data.tracks.items[0].name
            var albumTitle = data.tracks.items[0].album.name;
            var songLink = data.tracks.items[0].album.external_urls.spotify;
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // console.log(data.tracks.items[0]);
            console.log('Artist: ' + artist + '\nSong Title: ' + songTitle + '\nLink: ' + songLink + '\nAlbum: ' + albumTitle);
        });

}


function readRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',')
        var searchTerm = dataArr[1];
        spotifySong(searchTerm);

    })
};

// switchCase();




