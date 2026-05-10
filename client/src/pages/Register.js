import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Змінено з displayName на name
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Додано стан завантаження
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Реєстрація успішна! Тепер увійдіть.');
                navigate('/auth');
            } else {
                setError(data.message || 'Помилка реєстрації');
            }
        } catch (err) {
            setError('Не вдалося з’єднатися з сервером');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '5% 0',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div className="glass-box" style={{
                width: '90%',
                maxWidth: '420px',
                margin: '0 auto',
                padding: '5% 6%'
            }}>
                <h2 style={{ textAlign: 'center', marginTop: 0, marginBottom: '7%' }}>
                    Реєстрація
                </h2>
                {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '4%' }}>{error}</p>}
                <form onSubmit={handleRegister} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <input
                        type="text"
                        placeholder="Ваше ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="filter-btn"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            textAlign: 'center',
                            width: '80%',
                            padding: '3% 4%',
                            boxSizing: 'border-box',
                            marginBottom: '4%',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="filter-btn"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            textAlign: 'center',
                            width: '80%',
                            padding: '3% 4%',
                            boxSizing: 'border-box',
                            marginBottom: '4%',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль (від 6 символів)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="filter-btn"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            textAlign: 'center',
                            width: '80%',
                            padding: '3% 4%',
                            boxSizing: 'border-box',
                            marginBottom: '5%',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    />
                    <button
                        type="submit"
                        className="join-btn"
                        disabled={loading}
                        style={{
                            width: '80%',
                            margin: 0,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Завантаження...' : 'Зареєструватися'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;