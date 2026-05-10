'use strict';

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg }     = require('@prisma/adapter-pg');
const { Pool }         = require('pg');

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());

const PORT       = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'lab5_secret_key';


const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Необхідна авторизація' });
    }
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userEmail = decoded.email;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Сесія завершена, увійдіть знову' });
    }
};

const findOrCreateUser = async (email) => {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: { email, password: '', name: email }
        });
    }
    return user;
};

// Health-check
app.get('/api/message', (req, res) => {
    res.json({ message: 'Server is running.' });
});

// реєстрація
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email та пароль обов'язкові" });
        }
        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.create({ data: { name, email, password: hashed } });
        res.status(201).json({ message: 'Користувача успішно створено' });
    } catch (err) {
        res.status(400).json({ message: 'Email вже зареєстрований або дані некоректні' });
    }
});

// логін
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Невірний email або пароль' });
        }
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, email: user.email, name: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/initiatives
app.get('/api/initiatives', async (req, res) => {
    try {
        const initiatives = await prisma.initiative.findMany({
            include: { ratings: true, joins: true },
            orderBy: { createdAt: 'desc' }
        });
        const result = initiatives.map(ini => {
            const count   = ini.ratings.length;
            const sum     = ini.ratings.reduce((acc, r) => acc + r.value, 0);
            const average = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
            return {
                ...ini,
                averageRating: average,
                ratingCount: count,
                current: ini.joins.length,
                ratings: undefined,
                joins: undefined,
            };
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/initiatives   нова
app.post('/api/initiatives', authenticate, async (req, res) => {
    try {
        const { title, desc, needed, category, location, date } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Назва обов\'язкова' });
        }
        const firebaseId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

        const initiative = await prisma.initiative.create({
            data: {
                firebaseId,
                title,
                desc:     desc     || '',
                needed:   needed   ? parseInt(needed) : 0,
                category: category || '',
                location: location || '',
                date:     date     || '',
            }
        });

        res.status(201).json({ ...initiative, averageRating: 0, ratingCount: 0, current: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/initiatives/:id/join
app.post('/api/initiatives/:id/join', authenticate, async (req, res) => {
    try {
        const initiativeId = parseInt(req.params.id);
        const user = await findOrCreateUser(req.userEmail);

        await prisma.join.upsert({
            where:  { userId_initiativeId: { userId: user.id, initiativeId } },
            update: {},
            create: { userId: user.id, initiativeId }
        });

        const count = await prisma.join.count({ where: { initiativeId } });
        res.json({ message: 'Долучились!', current: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/initiatives/:id/join вийти
app.delete('/api/initiatives/:id/join', authenticate, async (req, res) => {
    try {
        const initiativeId = parseInt(req.params.id);
        const user = await findOrCreateUser(req.userEmail);

        await prisma.join.deleteMany({
            where: { userId: user.id, initiativeId }
        });

        const count = await prisma.join.count({ where: { initiativeId } });
        res.json({ message: 'Вийшли', current: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/me/joins  вже долучився юзер
app.get('/api/me/joins', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.userEmail },
            include: { joins: { select: { initiativeId: true } } }
        });
        if (!user) return res.json([]);
        const ids = user.joins.map(j => j.initiativeId);
        res.json(ids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/initiatives/:firebaseId/ratings
app.post('/api/initiatives/:id/ratings', authenticate, async (req, res) => {
    try {
        const initiativeId = parseInt(req.params.id);
        const { value } = req.body;

        if (!value || value < 1 || value > 5) {
            return res.status(400).json({ message: 'Оцінка має бути від 1 до 5' });
        }

        const user = await findOrCreateUser(req.userEmail);

        await prisma.rating.upsert({
            where:  { userId_initiativeId: { userId: user.id, initiativeId } },
            update: { value: parseInt(value) },
            create: { value: parseInt(value), userId: user.id, initiativeId }
        });

        const allRatings = await prisma.rating.findMany({ where: { initiativeId } });
        const sum     = allRatings.reduce((acc, r) => acc + r.value, 0);
        const average = parseFloat((sum / allRatings.length).toFixed(2));

        res.json({ message: 'Оцінку збережено', averageRating: average, ratingCount: allRatings.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(err.status || 500).json({ message: err.message });
});

const path = require('path');

// роздає зібраний фронтенд
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});