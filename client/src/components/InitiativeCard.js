import React, { useState } from 'react';

function StarRating({ rating, onRate, userRated, disabled }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    onClick={() => !disabled && !userRated && onRate(star)}
                    onMouseEnter={() => !disabled && !userRated && setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                        fontSize: '1.3rem',
                        cursor: disabled || userRated ? 'default' : 'pointer',
                        color: star <= (hovered || Math.round(rating)) ? '#ffd700' : 'rgba(255,255,255,0.25)',
                        transition: 'color 0.15s',
                        userSelect: 'none'
                    }}
                >★</span>
            ))}
            <span style={{ fontSize: '0.8rem', color: '#ccc', marginLeft: '4px' }}>
                {rating > 0 ? Number(rating).toFixed(2) : '—'}
            </span>
        </div>
    );
}

function InitiativeCard({ item, onJoin, isJoined, isCabinet, user, onRate }) {
    const [localRating, setLocalRating] = useState(item.averageRating || 0);
    const [localCount,  setLocalCount]  = useState(item.ratingCount   || 0);
    const [loadingRate, setLoadingRate] = useState(false);

    const ratedKey  = `rated_${item.id}`;
    const userRated = !!localStorage.getItem(ratedKey);

    const handleRate = async (star) => {
        if (!user || loadingRate) return;
        setLoadingRate(true);

        // Токен зберігається в localStorage після логіну через наш бекенд
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Увійдіть в акаунт щоб оцінювати.");
            setLoadingRate(false);
            return;
        }

        try {
            const res  = await fetch(`http://localhost:5001/api/initiatives/${item.id}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value: star })
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Помилка збереження оцінки');
                setLoadingRate(false);
                return;
            }

            localStorage.setItem(ratedKey, '1');
            setLocalRating(data.averageRating);
            setLocalCount(data.ratingCount);
            if (onRate) onRate(item.id, data.averageRating, data.ratingCount);

        } catch {
            alert("Сервер недоступний. Спробуйте пізніше.");
        }

        setLoadingRate(false);
    };

    return (
        <article className="project-card">
            <h3>{item.title}</h3>
            <div className="card-meta">
                <span>📅 {item.date}</span>
                <span>📍 {item.location}</span>
                {!isCabinet && <span className="volunteers-count">👥 {item.current}/{item.needed}</span>}
            </div>
            <p>{item.desc}</p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '2px' }}>
                    {userRated
                        ? 'Вашу оцінку враховано ✓'
                        : user
                            ? 'Оцініть ініціативу:'
                            : 'Рейтинг'
                    }
                    {localCount > 0 &&
                        <span style={{ marginLeft: '8px', opacity: 0.6 }}>
                            ({localCount} {localCount === 1 ? 'відгук' : localCount < 5 ? 'відгуки' : 'відгуків'})
                        </span>
                    }
                    {loadingRate && <span style={{ marginLeft: '8px', opacity: 0.6 }}>збереження...</span>}
                </div>
                <StarRating
                    rating={localRating}
                    onRate={handleRate}
                    userRated={userRated}
                    disabled={!user || loadingRate}
                />
            </div>

            <button
                className="join-btn"
                onClick={() => onJoin(item.id)}
                style={
                    isCabinet
                        ? { background: 'rgba(255, 77, 77, 0.6)', cursor: 'pointer' }
                        : isJoined
                            ? { background: '#28a745', opacity: 0.7, cursor: 'default' }
                            : {}
                }
                disabled={isJoined && !isCabinet}
            >
                {isCabinet ? 'Скасувати' : isJoined ? 'Ви долучилися' : 'Долучитися'}
            </button>
        </article>
    );
}

export default InitiativeCard;