import React, { useState } from 'react';
import InitiativeCard from '../components/InitiativeCard';

function MyInitiatives({ initiatives, joinedIds, onLeave }) {
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = [
        { id: 'all', title: 'Всі' },
        { id: 'nature', title: 'Природа' },
        { id: 'animals', title: 'Тварини' },
        { id: 'social', title: 'Місто' }
    ];

    const myProjects = initiatives.filter(item =>
        joinedIds.includes(item.id) &&
        (filterCategory === 'all' || item.category === filterCategory)
    );

    return (
        <main className="my-initiatives-page">
            <section className="grid-section">
                <div className="glass-box">
                    <h1 style={{ textTransform: 'lowercase', margin: 0 }}>користувач</h1>
                </div>
                <div className="glass-box" style={{ padding: '20px' }}>
                    <p style={{ fontSize: '1.2rem', margin: '5px 0' }}>Бугай Роман</p>
                    <p style={{ fontSize: '1rem', opacity: 0.9 }}>20 років</p>
                </div>
            </section>

            <section id="my_to_do" className="grid-section">
                <div className="section-intro glass-box">
                    <h2>Заплановано</h2>
                    <div className="filter-container" style={{ marginTop: '20px' }}>
                        {categories.map(cat => (
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

                <div className="project-list">
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
                        <p style={{ color: 'white', textAlign: 'center', width: '100%', marginTop: '40px' }}>Порожньо.</p>
                    )}
                </div>
            </section>
        </main>
    );
}

export default MyInitiatives;