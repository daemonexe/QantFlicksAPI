const { getMovieSummary, getQuizContentJSON, isValid } = require('../generator.cjs');
const { fetchMovieDetails } = require('../details.cjs');

console.log("🚀 Vercel API: Server running and ready to accept requests!");

module.exports = async (req, res) => {
  console.log("📩 Received request:", req.method, req.url);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log("⚙️ CORS preflight handled");
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log("❌ Invalid method:", req.method);
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { movieName } = req.body;

  if (!movieName) {
    console.log("❗ No movie name received");
    return res.status(400).json({ error: 'Movie name is required' });
  }

  console.log("🎬 Searching movie:", movieName);

  const quizPrompt = `...`; // Use your quiz prompt content
  const condition = `
with your knowledge check if is a valid movie or tv show if you could not find 
anything just return a string 'false', if you did 'true'
`;

  try {
    const isMovie = await isValid(condition, movieName);
    console.log("✅ isValid response:", isMovie);

    if (isMovie.toLowerCase() !== 'true') {
      console.log("❌ Invalid or not found:", movieName);
      return res.status(404).json({ error: 'Movie not found or invalid' });
    }

    const summaryPrompt = `Write a comprehensive, Wikipedia-style article about the movie/TV show "${movieName}". 
Format the response in valid HTML with proper headings (<h2>), paragraphs (<p>), and lists (<ul>, <li>).
Ensure the article includes structured sections like Introduction, Cast and Characters, Plot Summary, Critical Reception, etc.`;

    const movieData = await fetchMovieDetails(movieName);
    console.log("📦 Movie details fetched");

    const summary = await getMovieSummary(summaryPrompt, movieName);
    console.log("📝 Summary generated");

    const questions = await getQuizContentJSON(quizPrompt, movieName);
    const questionJSON = JSON.parse(questions);
    console.log("❓ Quiz generated");

    return res.status(200).json({
      movieName,
      movieSummary: summary,
      quizContent: questionJSON,
      details: movieData
    });
  } catch (err) {
    console.error("💥 Error:", err.message);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  }
};
