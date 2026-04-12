import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyInitiatives from './pages/MyInitiatives';
import About from './pages/About';
import Footer from './components/Footer';
import './App.css';

function App() {
    const [initiatives, setInitiatives] = useState([]);
    const [joinedIds, setJoinedIds] = useState(
        JSON.parse(localStorage.getItem('myInitiatives')) || []
    );

    useEffect(() => {
        const dataUrl = process.env.PUBLIC_URL + '/data.json';
        fetch(dataUrl)
            .then(res => res.json())
            .then(data => {
                const savedData = JSON.parse(localStorage.getItem('all_initiatives'));
                setInitiatives(savedData || data);
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    const handleJoin = (id) => {
        if (!joinedIds.includes(id)) {
            const updated = initiatives.map(item =>
                item.id === id ? { ...item, current: item.current + 1 } : item
            );
            const newJoined = [...joinedIds, id];

            setInitiatives(updated);
            setJoinedIds(newJoined);

            localStorage.setItem('all_initiatives', JSON.stringify(updated));
            localStorage.setItem('myInitiatives', JSON.stringify(newJoined));
        }
    };

    const handleLeave = (id) => {
        const updated = initiatives.map(item =>
            item.id === id ? { ...item, current: Math.max(0, item.current - 1) } : item
        );
        const newJoined = joinedIds.filter(joinedId => joinedId !== id);

        setInitiatives(updated);
        setJoinedIds(newJoined);

        localStorage.setItem('all_initiatives', JSON.stringify(updated));
        localStorage.setItem('myInitiatives', JSON.stringify(newJoined));
    };

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="content-area">
                    <Routes>
                        <Route path="/" element={<Home initiatives={initiatives} setInitiatives={setInitiatives} joinedIds={joinedIds} onJoin={handleJoin} />} />
                        <Route path="/my-initiatives" element={<MyInitiatives initiatives={initiatives} joinedIds={joinedIds} onLeave={handleLeave} />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<Home initiatives={initiatives} setInitiatives={setInitiatives} joinedIds={joinedIds} onJoin={handleJoin} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;