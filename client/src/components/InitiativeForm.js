import React, { useState } from 'react';
import { CATEGORIES } from '../constants';


function InitiativeForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0].id);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [needed, setNeeded] = useState('');
    const [desc, setDesc] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (title.trim().length <= 2) {
            alert("Назва ініціативи повинна бути довшою за 2 символи!");
            return;
        }
        if (parseInt(needed) <= 0) {
            alert("Кількість волонтерів має бути більшою за 0!");
            return;
        }
        if (!date) {
            alert("Будь ласка, оберіть дату проведення!");
            return;
        }

        onAdd({
            title: title.trim(),
            category,
            date,
            location: location.trim(),
            desc: desc.trim(),
            needed: parseInt(needed)
        });

        setTitle(''); setDate(''); setLocation(''); setNeeded(''); setDesc('');
        setCategory(CATEGORIES[0].id);
    };

    return (
        <section className="grid-section">
            <div className="glass-box" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3>Створити власну ініціативу</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>

                    <input
                        type="text"
                        placeholder="Назва ініціативи"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px' }}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.title}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Локація"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Скільки треба людей"
                        value={needed}
                        onChange={(e) => setNeeded(e.target.value)}
                        required
                        min="1"
                    />

                    <textarea
                        placeholder="Короткий опис"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                    />

                    <button type="submit" className="join-btn">Опублікувати</button>
                </form>
            </div>
        </section>
    );
}

export default InitiativeForm;