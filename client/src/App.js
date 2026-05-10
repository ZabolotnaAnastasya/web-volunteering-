import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyInitiatives from './pages/MyInitiatives';
import About from './pages/About';
import Footer from './components/Footer';
import './App.css';
import Register from './pages/Register';
import Auth from './pages/Auth';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
    const [user, setUser] = useState(null);
    const [initiatives, setInitiatives] = useState([]);
    const [joinedIds, setJoinedIds] = useState([]);   // масив id ініціатив (число)
    const [loading, setLoading] = useState(true);

    // 1. Перевірка токена
    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        if (token && email) {
            setUser({ email });
        }
        setLoading(false);
    }, []);

    // 2. Завантаження ініціатив
    useEffect(() => {
        const fetchInitiatives = async () => {
            try {
                const res = await fetch(`${API_URL}/initiatives`);
                if (res.ok) {
                    setInitiatives(await res.json());
                }
            } catch (err) {
                console.error('Помилка завантаження ініціатив:', err);
            }
        };
        fetchInitiatives();
    }, []);

    // 3. Завантаження joinedIds коли є юзер
    useEffect(() => {
        if (!user) { setJoinedIds([]); return; }
        const fetchJoins = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/me/joins`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setJoinedIds(await res.json());
            } catch (err) {
                console.error('Помилка завантаження joins:', err);
            }
        };
        fetchJoins();
    }, [user]);

    // 4. Логін
    const handleLogin = (u) => {
        if (!u.token) return; // Захист від запису undefined
        localStorage.setItem('token', u.token);
        localStorage.setItem('userEmail', u.email);
        setUser({ email: u.email });
    };

    // 5. Вихід
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setUser(null);
        setJoinedIds([]);
    };


    // 6. Долучитися / вийти


    const handleJoin = async (initiativeId) => {
        const token = localStorage.getItem('token');
        if (!token) { alert('Тільки авторизовані користувачі можуть долучатися!'); return; }

        const isJoined = joinedIds.includes(initiativeId);
        const method   = isJoined ? 'DELETE' : 'POST';

        try {
            const res = await fetch(`${API_URL}/initiatives/${initiativeId}/join`, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setJoinedIds(prev =>
                    isJoined ? prev.filter(id => id !== initiativeId) : [...prev, initiativeId]
                );
                // Оновлюємо лічильник current
                setInitiatives(prev => prev.map(item =>
                    item.id === initiativeId ? { ...item, current: data.current } : item
                ));
            } else {
                alert(data.message || 'Помилка');
            }
        } catch (err) {
            console.error('Помилка join:', err);
        }
    };

    // 7. Оцінити
    const handleRate = async (initiativeId, value) => {
        const token = localStorage.getItem('token');
        if (!token) { alert('Тільки авторизовані користувачі можуть оцінювати!'); return; }

        try {
            const res = await fetch(`${API_URL}/initiatives/${initiativeId}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value })
            });
            const data = await res.json();
            if (res.ok) {
                setInitiatives(prev => prev.map(item =>
                    item.id === initiativeId
                        ? { ...item, averageRating: data.averageRating, ratingCount: data.ratingCount }
                        : item
                ));
            } else {
                alert(data.message || 'Помилка при збереженні оцінки');
            }
        } catch (err) {
            console.error('Помилка rating:', err);
        }
    };

    // 8. Додати нову ініціативу
    const handleAddInitiative = async (newInitData) => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined') {
            alert('Помилка авторизації. Будь ласка, увійдіть знову.');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/initiatives`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newInitData)
            });
            const data = await res.json();
            if (res.ok) {
                setInitiatives(prev => [data, ...prev]);
                alert('Ініціативу успішно опубліковано!');
            } else {
                alert(data.message || 'Помилка при створенні');
            }
        } catch (err) {
            console.error('Помилка створення:', err);
        }
    };

    if (loading) return <div className="loading">Завантаження...</div>;

    return (
        <Router>
            <div className="app-container">
                <Navbar user={user} onLogout={handleLogout} />
                <main className="content-area">
                    <Routes>
                        <Route path="/" element={
                            <Home
                                initiatives={initiatives}
                                joinedIds={joinedIds}
                                onJoin={handleJoin}
                                onRate={handleRate}
                                onAdd={handleAddInitiative}
                                user={user}
                            />
                        } />
                        <Route path="/auth" element={<Auth setUser={handleLogin} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/my-initiatives" element={
                            <MyInitiatives
                                initiatives={initiatives}
                                joinedIds={joinedIds}
                                onLeave={handleJoin}
                                onRate={handleRate}
                                user={user}
                                onLogout={handleLogout}
                            />
                        } />
                        <Route path="*" element={
                            <Home
                                initiatives={initiatives}
                                joinedIds={joinedIds}
                                onJoin={handleJoin}
                                onRate={handleRate}
                                onAdd={handleAddInitiative}
                                user={user}
                            />
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;