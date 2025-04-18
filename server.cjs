// server.js
// main server file (backend) of the program

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {fetchMovieDetails} = require("./details.cjs")
const {getMovieSummary, getQuizContentJSON, isValid} = require('./generator.cjs');
const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(bodyParser.json()); 


let condition = `
with your knowledge check if is a valid movie or tv show if you could not find 
anything just return a string 'false', if you did 'true'

`



// POST endpoint to receive movie name
app.post('/search', async (req, res) => {
    const { movieName } = req.body;

    let isMovie = await isValid(condition,movieName);

    if (!movieName) {
        return res.status(400).json({ error: "Movie name is required" });
    }

    if (isMovie === "True" || "true")
    {

      let summaryPrompt = `Write a comprehensive, Wikipedia-style article about the movie/TV show "${movieName}". 
      Format the response in valid HTML with proper headings (<h2>), paragraphs (<p>), and lists (<ul>, <li>).
      Ensure the article includes the following structured sections:
      
      <h2>Introduction</h2>
      <p>Provide a general overview of the movie/TV show, including its release date, genre, production studio, and key creators (director, writer, showrunner, etc.).</p>
      
      <h2>Cast and Characters</h2>
      <ul>
        <li>List major actors and the roles they played.</li>
        <li>Describe the significance of their characters and how they contribute to the story.</li>
      </ul>
      
      <h2>Protagonist Character Study</h2>
      <p>Provide an in-depth analysis of the protagonist’s personality, motivations, growth arc, relationships, and impact on the story. Include notable scenes that highlight their development.</p>
      
      <h2>Antagonist Character Study</h2>
      <p>Provide a detailed analysis of the antagonist’s background, ideology, motivations, and their dynamic with the protagonist. Explain how they drive conflict in the story.</p>
      
      <h2>Plot Summary</h2>
      <p>Give a detailed summary of the full story. For TV shows, summarize the premise and structure season-by-season if applicable.</p>
      
      <h2>Development and Production</h2>
      <p>Discuss the origins of the project, including how it was conceptualized, written, directed, and produced. Mention production companies, filming locations, budget, and any notable production events.</p>
      
      <h2>Critical Reception</h2>
      <p>Summarize critical and audience reviews. Include metrics like Rotten Tomatoes, IMDb, and Metacritic scores. Mention notable praise and criticisms from trusted reviewers.</p>
      
      <h2>Box Office Performance (if applicable)</h2>
      <p>Provide details on the movie's or show's financial performance, including opening weekend numbers, worldwide gross, and profitability.</p>
      
      <h2>Themes and Analysis</h2>
      <p>Discuss the central themes, symbolism, narrative techniques, and philosophical or societal messages explored in the film/show.</p>
      
      <h2>Cultural Impact</h2>
      <p>Explain how the movie or TV show impacted pop culture, inspired fan theories, memes, parodies, or references in other media.</p>
      
      <h2>Awards and Nominations</h2>
      <ul>
        <li>List major awards won (e.g., Oscars, Emmys, BAFTAs, etc.)</li>
        <li>Mention nominations and categories for each award ceremony.</li>
      </ul>
      
      <h2>Trivia and Behind-the-Scenes</h2>
      <ul>
        <li>Interesting production trivia, bloopers, or little-known facts about the making of the film/show.</li>
        <li>References or Easter eggs included by the creators.</li>
      </ul>
      
      <h2>Related Media</h2>
      <ul>
        <li>Spin-offs, sequels, prequels, or companion content (books, games, web series).</li>
        <li>Official soundtracks, merchandise, or adaptations.</li>
      </ul>
      
      <h2>Legacy</h2>
      <p>Summarize how the film or TV show is remembered today, its influence on future works, and any ongoing fanbase or community engagement.</p>
      
      Ensure the information is richly detailed, informative, and factually accurate. Format the response cleanly using appropriate HTML tags for easy rendering on a website.`;
      let movieData = await fetchMovieDetails(movieName);

      let summary = await getMovieSummary(summaryPrompt,movieName);



      res.json({ movieName: movieName, movieSummary: summary, 
        details : movieData });

    // returning a .JSON file containing all the details needed to be filled in 

    }else{
      console.log("could not find movie sad");
    }


});

app.listen(PORT, () => {
    console.log(`>> Server running on http://localhost:${PORT}`);
});
