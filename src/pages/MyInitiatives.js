import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import InitiativeCard from '../components/InitiativeCard';
import { ALL_CATEGORIES } from '../constants';

function MyInitiatives({ initiatives, joinedIds, onLeave, onRate, user, onLogout, authLoading }) {
    const [userName, setUserName] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.email));
                    setUserName(userDoc.exists() ? userDoc.data().name : user.email);
                } catch (error) {
                    setUserName(user.email);
                }
            }
        };
        fetchUserData();
    }, [user]);

    if (authLoading) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Завантаження...</div>;
    }

    if (!user) {
        return (
            <main className="my-initiatives-page" style={{ width: '90%', margin: '0 auto', textAlign: 'center' }}>
                <div className="glass-box" style={{ padding: '60px 20px', marginTop: '50px' }}>
                    <h2 style={{ textTransform: 'lowercase' }}>привіт, волонтере!</h2>
                    <p style={{ opacity: 0.8, marginBottom: '30px' }}>щоб переглянути свої ініціативи, будь ласка, увійдіть або зареєструйтеся</p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <Link to="/auth" className="join-btn" style={{ textDecoration: 'none', width: '180px', margin: '0' }}>Увійти</Link>
                        <Link to="/register" className="join-btn" style={{ textDecoration: 'none', width: '180px', margin: '0', background: 'rgba(255,255,255,0.1)' }}>Реєстрація</Link>
                    </div>
                </div>
            </main>
        );
    }

    const myProjects = initiatives.filter(item =>
        joinedIds.includes(item.id) &&
        (filterCategory === 'all' || item.category === filterCategory)
    );

    return (
        <main className="my-initiatives-page" style={{ width: '90%', margin: '0 auto' }}>
            <section className="profile-section" style={{ width: '100%', marginBottom: '2%' }}>
                <div className="glass-box" style={{ padding: '3%', marginBottom: '2%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ textTransform: 'lowercase', margin: '0', fontSize: '2.2rem' }}>користувач</h1>
                        <p style={{ fontSize: '1.8rem', margin: '0', fontWeight: 'bold' }}>{userName}</p>
                    </div>
                    <button onClick={onLogout} className="join-btn" style={{ width: 'auto', padding: '10px 30px', margin: '0' }}>Вийти</button>
                </div>
            </section>

            <section id="my_to_do" className="grid-section">
                <div className="section-intro glass-box">
                    <h2>Заплановано</h2>
                    <div className="filter-container">
                        {ALL_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${filterCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setFilterCategory(cat.id)}
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
                                onRate={onRate}
                                isJoined={true}
                                isCabinet={true}
                                user={user}
                            />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', opacity: 0.5, padding: '40px', width: '100%', color: 'white' }}>
                            У вас ще немає запланованих ініціатив.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}

export default MyInitiatives;