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
import { collection, getDocs, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function App() {
    const [user, setUser] = useState(null);
    const [initiatives, setInitiatives] = useState([]);
    const [joinedIds, setJoinedIds] = useState(
        JSON.parse(localStorage.getItem('myInitiatives')) || []
    );

    // стан авторизації
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "initiatives"));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate ? doc.data().date.toDate().toLocaleDateString('uk-UA') : doc.data().date
                }));
                setInitiatives(data);
            } catch (error) {
                console.error("Помилка завантаження даних з Firebase:", error);

            }
        };
        fetchData();
    }, []);

    // вилогуватись
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Помилка при виході:", error);
        }
    };

    const handleJoin = async (id) => {
        if (joinedIds.includes(id)) return;

        try {
            // оновл лічильника
            const docRef = doc(db, "initiatives", id);
            await updateDoc(docRef, {
                current: increment(1)
            });

            // локальний стан
            const newJoined = [...joinedIds, id];
            setJoinedIds(newJoined);
            localStorage.setItem('myInitiatives', JSON.stringify(newJoined));

            setInitiatives(prev => prev.map(item =>
                item.id === id ? { ...item, current: (item.current || 0) + 1 } : item
            ));
        } catch (error) {
            console.error("Помилка приєднання:", error);
        }
    };

    // скасув ініціативу
    const handleLeave = (id) => {
        const newJoined = joinedIds.filter(itemId => itemId !== id);
        setJoinedIds(newJoined);
        localStorage.setItem('myInitiatives', JSON.stringify(newJoined));

        setInitiatives(prev => prev.map(item =>
            item.id === id ? { ...item, current: Math.max(0, item.current - 1) } : item
        ));
    };

    return (
        <Router>
            <div className="app-container">
                <Navbar user={user} />
                <main className="content-area">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home
                                    initiatives={initiatives}
                                    setInitiatives={setInitiatives}
                                    joinedIds={joinedIds}
                                    onJoin={handleJoin}
                                />
                            }
                        />

                        <Route path="/auth" element={<Auth />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />

                        <Route
                            path="/my-initiatives"
                            element={
                                <MyInitiatives
                                    initiatives={initiatives}
                                    setInitiatives={setInitiatives}
                                    joinedIds={joinedIds}
                                    onLeave={handleLeave}
                                    user={user}
                                    onLogout={handleLogout}
                                />
                            }
                        />

                        <Route
                            path="*"
                            element={
                                <Home
                                    initiatives={initiatives}
                                    setInitiatives={setInitiatives}
                                    joinedIds={joinedIds}
                                    onJoin={handleJoin}
                                />
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;