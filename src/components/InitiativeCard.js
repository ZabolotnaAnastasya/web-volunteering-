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
                >
                    ★
                </span>
            ))}
            <span style={{ fontSize: '0.8rem', color: '#ccc', marginLeft: '4px' }}>
                {rating > 0 ? rating.toFixed(1) : '—'}
            </span>
        </div>
    );
}

function InitiativeCard({ item, onJoin, isJoined, isCabinet, user, onRate }) {
    const rating = item.rating || 0;
    const ratingCount = item.ratingCount || 0;
    // ? юзер вже оцінив
    const ratedKey = `rated_${item.id}`;
    const userRated = !!localStorage.getItem(ratedKey);

    const handleRate = async (star) => {
        if (!user) {
            alert("Тільки авторизовані користувачі можуть ставити оцінки!");
            return;
        }
        localStorage.setItem(ratedKey, '1');
        onRate(item.id, star, rating, ratingCount);
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


            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '10px',
                marginTop: '10px'
            }}>
                <div style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '2px' }}>
                    {userRated
                        ? 'Ваша оцінка враховано'
                        : user
                            ? 'Оцініть ініціативу:'
                            : `Рейтинг: ${ratingCount} відгук${ratingCount === 1 ? '' : ratingCount >= 2 && ratingCount <= 4 ? 'и' : 'ів'}`
                    }
                    {ratingCount > 0 && user && !userRated &&
                        <span style={{ marginLeft: '8px', opacity: 0.6 }}>({ratingCount} відг.)</span>
                    }
                </div>
                <StarRating
                    rating={rating}
                    onRate={handleRate}
                    userRated={userRated}
                    disabled={!user}
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