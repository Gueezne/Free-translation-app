const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try{
        const {text, source, target} = req.query;
        if (!text || !source || !target) {
            return res.status(400).send('Missing text, source, or target query parameter');
        }
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(source)}|${encodeURIComponent(target)}`;
        const response = await fetch(url);
        const json = await response.json();
        const matches = Array.isArray(json?.matches) ? json.matches : [];
        const fromMatches = matches.length ? (matches[matches.length - 1]?.translation) : undefined;
        const translatedText = fromMatches || json?.responseData?.translatedText || 'No translation found';
        res.send(translatedText);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong!');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});