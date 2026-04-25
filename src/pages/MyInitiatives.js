import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import InitiativeCard from '../components/InitiativeCard';

function MyInitiatives({ initiatives, joinedIds, onLeave, user, onLogout }) {
    const [userName, setUserName] = useState('Завантаження...');
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = [
        { id: 'all', title: 'Всі' },
        { id: 'nature', title: 'Природа' },
        { id: 'animals', title: 'Тварини' },
        { id: 'social', title: 'Місто' }
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().name);
                    } else {
                        setUserName(user.email);
                    }
                } catch (error) {
                    setUserName(user.email);
                }
            }
        };
        fetchUserData();
    }, [user]);

    const myProjects = initiatives.filter(item =>
        joinedIds.includes(item.id) &&
        (filterCategory === 'all' || item.category === filterCategory)
    );

    return (
        <main className="my-initiatives-page" style={{ width: '90%', margin: '0 auto' }}>
            <section className="grid-section" style={{ width: '100%' }}>

                <div className="glass-box" style={{ padding: '3%', marginBottom: '2%' }}>
                    <h1 style={{
                        textTransform: 'lowercase',
                        margin: 0,
                        textAlign: 'left',
                        fontSize: '2.2rem',
                        opacity: 0.9
                    }}>
                        користувач
                    </h1>
                </div>


                <div className="glass-box" style={{
                    padding: '3%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '1.8rem', margin: '0', fontWeight: 'bold' }}>{userName}</p>
                        <p style={{ fontSize: '1.1rem', opacity: 0.7, margin: '5px 0 0' }}>Волонтер</p>
                    </div>

                    <button
                        onClick={onLogout}
                        className="join-btn"
                        style={{
                            width: 'auto',
                            padding: '1.2% 4%',
                            margin: 0,
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Вийти
                    </button>
                </div>
            </section>

            <section id="my_to_do" className="grid-section" style={{ width: '100%', marginTop: '4%' }}>
                <div className="section-intro glass-box" style={{ padding: '3%' }}>
                    <h2>Заплановано</h2>
                    <div className="filter-container" style={{ marginTop: '2%' }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${filterCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setFilterCategory(cat.id)}
                                style={{ padding: '0.8% 2.5%' }}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="project-list" style={{ marginTop: '3%' }}>
                    {myProjects.length > 0 ? (
                        myProjects.map(item => (
                            <InitiativeCard
                                key={item.id}
                                item={item}
                                onJoin={onLeave}
                                isJoined={true}
                                isCabinet={true}
                            />
                        ))
                    ) : (
                        <p style={{ color: 'white', textAlign: 'center', width: '100%', padding: '5%', opacity: 0.5 }}>
                            Порожньо.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}

export default MyInitiatives;