import React from 'react';
import InitiativeCard from '../components/InitiativeCard';
import InitiativeForm from '../components/InitiativeForm';

function Home({ initiatives, setInitiatives, joinedIds, onJoin }) {
    const addNewInitiative = (newInit) => {
        const updated = [newInit, ...initiatives];
        setInitiatives(updated);
        localStorage.setItem('all_initiatives', JSON.stringify(updated));
    };

    const categories = [
        { id: 'nature', title: 'Природа' },
        { id: 'animals', title: 'Тварини' },
        { id: 'social', title: 'Місто' }
    ];

    return (
        <div className="home-container">
            <InitiativeForm onAdd={addNewInitiative} />

            {categories.map(section => (
                <section key={section.id} id={section.id} className="grid-section">
                    <div className="section-intro glass-box">
                        <h2>{section.title}</h2>
                    </div>

                    <div className="project-list">
                        {initiatives
                            .filter(item => item.category === section.id && item.current < item.needed)
                            .map(item => (
                                <InitiativeCard
                                    key={item.id}
                                    item={item}
                                    onJoin={onJoin}
                                    isJoined={joinedIds.includes(item.id)}
                                    isCabinet={false}
                                />
                            ))
                        }
                    </div>

                    {initiatives.filter(item => item.category === section.id && item.current < item.needed).length === 0 && (
                        <p style={{ color: 'white', textAlign: 'center', opacity: 0.6 }}>
                            Активних запитів у цій категорії немає.
                        </p>
                    )}
                </section>
            ))}
        </div>
    );
}

export default Home;