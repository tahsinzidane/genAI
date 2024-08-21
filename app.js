require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = 3000;

// Set up Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname,  'public')));

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route to render the form
app.get('/', (req, res) => {
    res.render('index', { responseText: '' });
});

// Route to handle form submission
app.post('/generate', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        res.render('index', { responseText: 'Please provide a prompt.' });
        return;
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        res.render('index', { responseText: text });
    } catch (error) {
        console.error('Error:', error);
        res.render('index', { responseText: 'An error occurred while generating content.' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
