const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuration des vues
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour traiter les données des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============ CONFIGURATION NODEMAILER ETHEREAL ============
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'barney.johns@ethereal.email',
        pass: '5knqqdjPdxaYzAzX5T'
    }
});

// Test de connexion
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ Erreur email:', error);
    } else {
        console.log('✅ EMAILS PRÊTS ! Compte: barney.johns@ethereal.email');
        console.log('🔗 Voir les emails: https://ethereal.email');
    }
});

// ============ ROUTES GET ============
app.get(['/', '/index'], (req, res) => {
    res.render('index');
});


app.get('/about', (req, res) => {
    res.render('about');
});


app.get('/practice-area', (req, res) => {
    res.render('practice-area');
});


app.get('/attorney', (req, res) => {
    res.render('attorney');
});


app.get('/attorney-detail', (req, res) => {
    res.render('attorney-detail');
});


app.get('/faq', (req, res) => {
    res.render('faq');
});

app.get('/blog-archive', (req, res) => {
    res.render('blog-archive');
});


app.get('/legal-notice', (req, res) => {
    res.render('legal-notice');
});

app.get('/feature', (req, res) => {
    res.render('feature');
});


app.get('/reservation', (req, res) => {
    res.render('reservation');
});


app.get('/contact', (req, res) => {
    res.render('contact');
});


app.get('/practice-area-detail', (req, res) => {
    res.render('practice-area-detail');
});


app.get('/testimonial', (req, res) => {
    res.render('testimonial');
});


app.get('/reservation-success', (req, res) => {
    res.render('reservation-success', { 
        title: 'Réservation Confirmée !',
        message: 'Votre demande de rendez-vous a été envoyée avec succès. Notre équipe vous contactera dans les plus brefs délais pour confirmer votre rendez-vous.',
        contactInfo: 'Pour toute urgence, contactez-nous au +243 995 482 416'
    });
});


app.get('/contact-success', (req, res) => {
    res.render('contact-success', {
        title: 'Message Envoyé !',
        message: 'Votre message a été transmis à notre équipe. Nous vous répondrons dans les 24 à 48 heures.',
        contactInfo: 'Pour une réponse plus rapide, appelez-nous au +243 995 482 416'
    });
});

// ============ ROUTES POST ============

// Route pour traiter le formulaire de réservation
app.post('/reservation', async (req, res) => {
    try {
        const { 
            firstname,          // Prénom
            lastname,           // Nom
            middlename,         // Post-Nom
            email, 
            address, 
            'phone-no': phone, 
            date, 
            time, 
            note 
        } = req.body;
        
        // Validation basique
        if (!firstname || !lastname || !email || !phone) {
            return res.status(400).send('Veuillez remplir tous les champs obligatoires');
        }
        
        // Combiner tous les noms
        const clientFullName = `${firstname} ${lastname} ${middlename || ''}`.trim();
        
        console.log('📅 NOUVELLE RÉSERVATION REÇUE :');
        console.log('===============================');
        console.log(`👤 Client : ${clientFullName}`);
        console.log(`📧 Email : ${email}`);
        console.log(`📞 Téléphone : ${phone}`);
        console.log(`📍 Adresse : ${address}`);
        console.log(`📅 Date : ${date}`);
        console.log(`⏰ Heure : ${time}`);
        console.log('===============================');
        
        // Email pour le cabinet
        const mailToCabinet = {
            from: 'barney.johns@ethereal.email',
            to: 'barney.johns@ethereal.email',
            subject: `📅 Nouvelle réservation - ${clientFullName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8B0000;">Nouvelle demande de rendez-vous</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #8B0000;">
                        <p><strong style="color: #333;">👤 Client :</strong> ${clientFullName}</p>
                        <p><strong style="color: #333;">📧 Email :</strong> ${email}</p>
                        <p><strong style="color: #333;">📞 Téléphone :</strong> ${phone}</p>
                        <p><strong style="color: #333;">📍 Adresse :</strong> ${address}</p>
                        <p><strong style="color: #333;">📅 Date souhaitée :</strong> ${date}</p>
                        <p><strong style="color: #333;">⏰ Heure :</strong> ${time}</p>
                        <p><strong style="color: #333;">📝 Message :</strong></p>
                        <p style="background: white; padding: 15px; border-radius: 5px;">${note || 'Aucun message'}</p>
                    </div>
                    <hr style="margin: 30px 0;">
                    <p style="color: #666; font-size: 0.9em;">
                        Message envoyé depuis le site web J&J Law Firm<br>
                        Date d'envoi : ${new Date().toLocaleString('fr-FR')}
                    </p>
                </div>
            `
        };
        
        // Email de confirmation au client
        const mailToClient = {
            from: 'barney.johns@ethereal.email',
            to: email,
            subject: '✅ Confirmation de votre réservation - J&J Law Firm',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8B0000;">Bonjour ${clientFullName},</h2>
                    <p>Nous avons bien reçu votre demande de rendez-vous.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #333;">Détails de votre réservation :</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 10px 0;">👤 <strong>Nom complet :</strong> ${clientFullName}</li>
                            <li style="margin: 10px 0;">📅 <strong>Date souhaitée :</strong> ${date}</li>
                            <li style="margin: 10px 0;">⏰ <strong>Heure :</strong> ${time}</li>
                            <li style="margin: 10px 0;">📞 <strong>Téléphone :</strong> ${phone}</li>
                            <li style="margin: 10px 0;">📍 <strong>Adresse :</strong> ${address}</li>
                            ${note ? `<li style="margin: 10px 0;">📝 <strong>Votre message :</strong><br>${note}</li>` : ''}
                        </ul>
                    </div>
                    
                    <p>✅ <strong>Étapes suivantes :</strong></p>
                    <ol>
                        <li>Notre équipe va analyser votre demande</li>
                        <li>Nous vous contacterons dans les <strong>24 heures</strong> pour confirmer votre rendez-vous</li>
                        <li>Préparez les documents relatifs à votre dossier</li>
                    </ol>
                    
                    <div style="background: #e9f7fe; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                        <h4 style="color: #0c5460; margin-top: 0;">📞 Contact rapide :</h4>
                        <p style="margin: 5px 0;"><strong>Cabinet J&J Law Firm</strong></p>
                        <p style="margin: 5px 0;">📞 <strong>Téléphone :</strong> +243 995 482 416</p>
                        <p style="margin: 5px 0;">📧 <strong>Email :</strong> barney.johns@ethereal.email</p>
                        <p style="margin: 5px 0;">📍 <strong>Adresse :</strong> nᵒ 148/A, Blvd du 30 Juin, Gombe, Kinshasa</p>
                    </div>
                    
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        Ceci est un message automatique de confirmation.<br>
                        Si vous n'avez pas fait cette demande, veuillez ignorer cet email.
                    </p>
                </div>
            `
        };
        
        // Envoyer les emails
        await transporter.sendMail(mailToCabinet);
        console.log('✅ Email envoyé au cabinet');
        
        if (email) {
            await transporter.sendMail(mailToClient);
            console.log('✅ Email de confirmation envoyé au client');
        }
        
        // Rediriger vers la page de succès
        res.redirect('/reservation-success');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi des emails :', error);
        // Rediriger vers la page de succès même en cas d'erreur
        res.redirect('/reservation-success');
    }
});

// Route pour traiter le formulaire de contact
app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).send('Veuillez remplir tous les champs obligatoires');
        }
        
        console.log('📨 NOUVEAU MESSAGE DE CONTACT :');
        console.log('===============================');
        console.log(`👤 De : ${name}`);
        console.log(`📧 Email : ${email}`);
        console.log(`📌 Sujet : ${subject || '(Aucun sujet)'}`);
        console.log(`💬 Message : ${message}`);
        console.log('===============================');
        
        // Email pour le cabinet
        const mailToCabinet = {
            from: 'barney.johns@ethereal.email',
            to: 'barney.johns@ethereal.email',
            subject: `📧 ${subject || 'Nouveau message'} - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8B0000;">Nouveau message depuis le site</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #8B0000;">
                        <p><strong style="color: #333;">👤 De :</strong> ${name}</p>
                        <p><strong style="color: #333;">📧 Email :</strong> ${email}</p>
                        ${subject ? `<p><strong style="color: #333;">📌 Sujet :</strong> ${subject}</p>` : ''}
                        <p><strong style="color: #333;">💬 Message :</strong></p>
                        <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
                    </div>
                    <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
                        Date d'envoi : ${new Date().toLocaleString('fr-FR')}
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(mailToCabinet);
        console.log('✅ Email de contact envoyé au cabinet');
        
        res.redirect('/contact-success');
        
    } catch (error) {
        console.error('❌ Erreur email contact :', error);
        res.redirect('/contact-success');
    }
});




// Route pour traiter les questions FAQ
app.post('/faq-question', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        // Validation
        if (!name || !message) {
            return res.status(400).json({ error: 'Veuillez remplir au moins votre nom et votre question' });
        }
        
        console.log('❓ NOUVELLE QUESTION FAQ :');
        console.log('==========================');
        console.log(`👤 De : ${name}`);
        console.log(`📧 Email : ${email || '(Non fourni)'}`);
        console.log(`📞 Téléphone : ${phone || '(Non fourni)'}`);
        console.log(`💬 Question : ${message}`);
        console.log('==========================');
        
        // Email pour le cabinet
        const mailToCabinet = {
            from: 'barney.johns@ethereal.email',
            to: 'barney.johns@ethereal.email',
            subject: `❓ Question FAQ - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8B0000;">Nouvelle question depuis la FAQ</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #2196F3;">
                        <p><strong style="color: #333;">👤 Client :</strong> ${name}</p>
                        ${email ? `<p><strong style="color: #333;">📧 Email :</strong> ${email}</p>` : ''}
                        ${phone ? `<p><strong style="color: #333;">📞 Téléphone :</strong> ${phone}</p>` : ''}
                        <p><strong style="color: #333;">💬 Question :</strong></p>
                        <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
                    </div>
                    <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
                        <strong>📌 Pour répondre :</strong> ${email ? `Répondez à cet email` : `Contactez le client au ${phone}`}
                    </p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #999; font-size: 0.8em;">
                        Envoyé depuis la page FAQ du site J&J Law Firm<br>
                        Date : ${new Date().toLocaleString('fr-FR')}
                    </p>
                </div>
            `
        };
        
        // Email de confirmation au client
        const mailToClient = {
            from: 'barney.johns@ethereal.email',
            to: email,
            subject: '✅ Nous avons reçu votre question - J&J Law Firm',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8B0000;">Bonjour ${name},</h2>
                    <p>Nous avons bien reçu votre question via notre page FAQ.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #333;">Votre question :</h3>
                        <p style="background: white; padding: 15px; border-radius: 5px; font-style: italic;">"${message}"</p>
                    </div>
                    
                    <p>✅ <strong>Notre engagement :</strong></p>
                    <ul>
                        <li>Notre équipe d'avocats analyse votre question</li>
                        <li>Vous recevrez une réponse détaillée dans les <strong>48 heures</strong></li>
                        <li>Pour les urgences, appelez-nous directement</li>
                    </ul>
                    
                    <div style="background: #e9f7fe; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2196F3;">
                        <h4 style="color: #0c5460; margin-top: 0;">📞 Contact rapide :</h4>
                        <p style="margin: 5px 0;"><strong>Cabinet J&J Law Firm</strong></p>
                        <p style="margin: 5px 0;">📞 <strong>Téléphone :</strong> +243 995 482 416</p>
                        <p style="margin: 5px 0;">📧 <strong>Email :</strong> barney.johns@ethereal.email</p>
                        <p style="margin: 5px 0;">📍 <strong>Adresse :</strong> nᵒ 148/A, Blvd du 30 Juin, Gombe, Kinshasa</p>
                    </div>
                    
                    <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                        Ceci est un message automatique de confirmation.<br>
                        Si vous n'avez pas fait cette demande, veuillez ignorer cet email.
                    </p>
                </div>
            `
        };
        
        // Envoyer les deux emails
        await transporter.sendMail(mailToCabinet);
        console.log('✅ Email FAQ envoyé au cabinet');
        
        if (email) {
            await transporter.sendMail(mailToClient);
            console.log('✅ Email de confirmation FAQ envoyé au client');
        }
        
        res.status(200).json({ success: true, message: 'Question envoyée avec succès' });
        
    } catch (error) {
        console.error('❌ Erreur FAQ email :', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de la question' });
    }
});

// ============ GESTION DES ERREURS ============


app.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Page Non Trouvée',
        message: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
        homeLink: '/'
    });
});


app.use((err, req, res, next) => {
    console.error('❌ ERREUR SERVEUR :', err.stack);
    res.status(500).render('500', {
        title: 'Erreur Serveur',
        message: 'Une erreur technique est survenue. Notre équipe en a été informée.',
        contactInfo: 'Veuillez réessayer ou nous contacter au +243 995 482 416'
    });
});

// ============ DÉMARRAGE DU SERVEUR ============

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`📧 Email d'envoi : barney.johns@ethereal.email`);
    console.log(`🌐 Site accessible sur : http://localhost:${PORT}`);
    console.log('========================================');
});
