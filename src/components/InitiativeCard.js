import React from 'react';

function InitiativeCard({ item, onJoin, isJoined, isCabinet }) {
    return (
        <article className="project-card">
            <h3>{item.title}</h3>
            <div className="card-meta">
                <span>📅 {item.date}</span>
                <span>📍 {item.location}</span>
                {!isCabinet && <span className="volunteers-count">👥 {item.current}/{item.needed}</span>}
            </div>
            <p>{item.desc}</p>

            <button
                className="join-btn"
                onClick={() => onJoin(item.id)}
                style={
                    isCabinet
                        ? { background: 'rgba(255, 77, 77, 0.6)', cursor: 'pointer' } // Червона для скасування
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