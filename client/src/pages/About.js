import React from 'react';

function About() {
    return (
        <section className="about-page">
            <div className="glass-box" style={{ margin: '100px auto', maxWidth: '850px' }}>
                <h2>Хто ми?</h2>
                <img
                    src={process.env.PUBLIC_URL + '/logo.png'}
                    alt="Логотип"
                    style={{ height: '150px', display: 'block', margin: '0 auto 20px' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Logo+Missing'; }}
                />

                <p>
                    Ми — молода волонтерська організація, заснована на базі
                    <strong> Національного університету "Львівська політехніка" </strong>
                    літом 2025 року.
                </p>
                <p>
                    Наш проєкт створений студентами-ентузіастами, які хотіли об'єднати активну молодь
                    для допомоги своїй країні, природі та громаді.
                </p>

                <hr style={{ border: '0.5px solid rgba(255,255,255,0.2)', margin: '30px 0' }} />

                <h3>Наша місія</h3>
                <p style={{ fontStyle: 'italic', fontSize: '1.2rem' }}>"Твої руки — це сила".</p>
                <p>
                    Ми збираємо ресурси та енергію людей, щоб перетворити їх на щит для
                    нашої природи та суспільства. Кожен крок від лісу до міста —
                    це твоя можливість допомогти.
                </p>
            </div>
        </section>
    );

}

export default About;