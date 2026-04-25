import React from 'react';
import InitiativeCard from '../components/InitiativeCard';
import InitiativeForm from '../components/InitiativeForm';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

function Home({ initiatives, setInitiatives, joinedIds, onJoin }) {

    // + гова ініціатива
    const addNewInitiative = async (newInitData) => {
        try {
            const docToSave = {
                title: newInitData.title,
                desc: newInitData.desc,
                needed: Number(newInitData.needed),
                category: newInitData.category,
                current: 0,
                location: newInitData.location,
                date: newInitData.date
            };

            // запис в колекцію
            const docRef = await addDoc(collection(db, "initiatives"), docToSave);

            // локально оновл
            if (typeof setInitiatives === 'function') {
                const finalNewInit = {
                    ...docToSave,
                    id: docRef.id,
                    date: new Date().toLocaleDateString('uk-UA')
                };
                setInitiatives(prev => [finalNewInit, ...prev]);
            }

            alert("Ініціативу успішно опубліковано!");
        } catch (error) {
            console.error("Помилка запису в БД:", error);
            alert("Не вдалося зберегти ініціативу в базі даних: " + error.message);
        }
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