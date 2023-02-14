require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/artist-search", async (req, res) => {
    try {
        await spotifyApi
            .searchArtists(`${req.query.artist}`)
            .then(data => {
                //console.log(`Data received from the API:`, data);
                const artists = data.body.artists.items;
                // console.log(artists)
                res.render('artist-search-results', artists);
            })
    } catch (error) {
        console.log(error);
    }
});

app.get("/albums/:id", async (req, res) => {
    try {
        await spotifyApi
            .getArtistAlbums(req.params.id)
            .then(artistAlbumsData => {
                const artistAlbums = artistAlbumsData.body.items;
                res.render('albums', artistAlbums);
            })
    } catch (err) {
        console.log(error);
    }
})

app.get("/tracks/:id", async (req, res) => {
    try {
        await spotifyApi
            .getAlbumTracks(req.params.id)
            .then(albumTracksData => {
                const tracks = albumTracksData.body.items;
                res.render('tracks', tracks);
            })
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
