import React from 'react';
import InitiativeCard from '../components/InitiativeCard';
import InitiativeForm from '../components/InitiativeForm';
import { CATEGORIES } from '../constants';

function Home({ initiatives, joinedIds, onJoin, onRate, onAdd, user }) {
    return (
        <div className="home-container">
            <InitiativeForm onAdd={onAdd} user={user} />

            {CATEGORIES.map(section => (
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
                                    onRate={onRate}
                                    isJoined={joinedIds.includes(item.id)}
                                    isCabinet={false}
                                    user={user}
                                />
                            ))
                        }
                    </div>

                    {initiatives.filter(item => item.category === section.id && item.current < item.needed).length === 0 && (
                        <p style={{ color: 'white', textAlign: 'center', opacity: 0.6, padding: '20px' }}>
                            Активних запитів у цій категорії поки що немає.
                        </p>
                    )}
                </section>
            ))}
        </div>
    );
}

export default Home;