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
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    collection, getDocs, doc, getDoc, setDoc, updateDoc, increment, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const LS_KEY = 'myInitiatives';

function App() {
    const [user, setUser] = useState(null);
    const [initiatives, setInitiatives] = useState([]);
    const [joinedIds, setJoinedIds] = useState([]);
    const [authLoading, setAuthLoading] = useState(true);

    // Стан авторизації
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // ЛОГІН: завантажуємо масив з БД → кладемо в localStorage
                try {
                    const userSnap = await getDoc(doc(db, "users", currentUser.email));
                    let ids = [];
                    if (userSnap.exists()) {
                        ids = userSnap.data().joinedInitiatives || [];
                    } else {
                        // документа немає — створюємо
                        await setDoc(doc(db, "users", currentUser.email), {
                            email: currentUser.email,
                            joinedInitiatives: []
                        }, { merge: true });
                    }
                    localStorage.setItem(LS_KEY, JSON.stringify(ids));
                    setJoinedIds(ids);
                } catch (e) {
                    console.error("Помилка завантаження joinedInitiatives:", e);
                    const local = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
                    setJoinedIds(local);
                }
            } else {
                // НЕ ЗАЛОГОВАНИЙ: масив завжди порожній
                setJoinedIds([]);
            }
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Завантажуємо всі ініціативи з БД
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "initiatives"));
                const data = querySnapshot.docs.map(d => {
                    const raw = d.data();
                    return {
                        id: d.id,
                        ...raw,
                        current: Number(raw.current) || 0,
                        needed: Number(raw.needed) || 0,
                        date: raw.date?.toDate
                            ? raw.date.toDate().toLocaleDateString('uk-UA')
                            : raw.date
                    };
                });
                setInitiatives(data);
            } catch (error) {
                console.error("Помилка завантаження даних з Firebase:", error);
            }
        };
        fetchData();
    }, []);

    // Хелпер: оновити joinedIds і localStorage синхронно
    const updateJoinedLocal = (newIds) => {
        setJoinedIds(newIds);
        localStorage.setItem(LS_KEY, JSON.stringify(newIds));
    };

    // LOGOUT: зберігаємо localStorage → БД, потім чистимо
    const handleLogout = async () => {
        if (user) {
            try {
                const currentLocal = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
                await updateDoc(doc(db, "users", user.email), {
                    joinedInitiatives: currentLocal
                });
            } catch (e) {
                console.error("Помилка збереження перед виходом:", e);
            }
        }
        localStorage.removeItem(LS_KEY);
        try {
            await signOut(auth);
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    // Долучитися
    const handleJoin = async (id) => {
        if (!user) {
            alert("Тільки авторизовані користувачі можуть долучатися!");
            return;
        }
        if (joinedIds.includes(id)) return;

        // Одразу оновлюємо UI і localStorage
        const newIds = [...joinedIds, id];
        updateJoinedLocal(newIds);

        try {
            // Оновлюємо лічильник в ініціативі
            await updateDoc(doc(db, "initiatives", id), { current: increment(1) });
            // Записуємо id в масив joinedInitiatives юзера в БД
            await updateDoc(doc(db, "users", user.email), { joinedInitiatives: arrayUnion(id) });
            setInitiatives(prev => prev.map(item =>
                item.id === id ? { ...item, current: (item.current || 0) + 1 } : item
            ));
        } catch (e) {
            console.error("Помилка при долученні:", e);
            alert("Помилка: " + e.message);
            // відкочуємо локальний стан
            updateJoinedLocal(joinedIds);
        }
    };

    // Скасувати участь
    const handleLeave = async (id) => {
        const newIds = joinedIds.filter(itemId => itemId !== id);
        updateJoinedLocal(newIds);

        try {
            // Зменшуємо лічильник в ініціативі
            await updateDoc(doc(db, "initiatives", id), { current: increment(-1) });
            // Видаляємо id з масиву joinedInitiatives юзера в БД
            await updateDoc(doc(db, "users", user.email), { joinedInitiatives: arrayUnion(id) });
            setInitiatives(prev => prev.map(item =>
                item.id === id ? { ...item, current: Math.max(0, (item.current || 1) - 1) } : item
            ));
        } catch (e) {
            console.error("Помилка при скасуванні:", e);
            alert("Помилка: " + e.message);
            updateJoinedLocal(joinedIds);
        }
    };

    return (
        <Router>
            <div className="app-container">
                <Navbar user={user} />
                <main className="content-area">
                    <Routes>
                        <Route path="/" element={
                            <Home
                                initiatives={initiatives}
                                setInitiatives={setInitiatives}
                                joinedIds={joinedIds}
                                onJoin={handleJoin}
                                user={user}
                            />
                        } />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/my-initiatives" element={
                            <MyInitiatives
                                initiatives={initiatives}
                                setInitiatives={setInitiatives}
                                joinedIds={joinedIds}
                                onLeave={handleLeave}
                                user={user}
                                onLogout={handleLogout}
                                authLoading={authLoading}
                            />
                        } />
                        <Route path="*" element={
                            <Home
                                initiatives={initiatives}
                                setInitiatives={setInitiatives}
                                joinedIds={joinedIds}
                                onJoin={handleJoin}
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