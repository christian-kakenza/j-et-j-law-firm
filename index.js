import express from 'express';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route pour la page d'accueil
app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/', (req, res) => {
    res.render('index');
});

// Route pour la page "About Us"
app.get('/about', (req, res) => {
    res.render('about');
});

// Route pour la page "Practice Area"
app.get('/practice-area', (req, res) => {
    res.render('practice-area');
});

// Route pour la page "Attorneys"
app.get('/attorney', (req, res) => {
    res.render('attorney');
});

// Route pour la page "Attorney Detail"
app.get('/attorney-detail', (req, res) => {
    res.render('attorney-detail');
});

// Route pour la page "FAQs"
app.get('/faq', (req, res) => {
    res.render('faq');
});

app.get('/blog-archive', (req, res) => {
    res.render('blog-archive');
});

// Route pour la page "Legal Notice"
app.get('/legal-notice', (req, res) => {
    res.render('legal-notice'); 
});

app.get('/feature', (req, res) => {
    res.render('feature'); 
});

// Route pour la page "Reservation"
app.get('/reservation', (req, res) => {
    res.render('reservation');
});

// Route pour la page "Contact"
app.get('/contact', (req, res) => {
    res.render('contact');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
