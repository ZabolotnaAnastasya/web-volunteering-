import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = '/api';

function Auth({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data); // data вже містить { token, email, name }
                navigate('/');
            } else {
                setError(data.message || 'Невірний логін або пароль');
            }
        } catch (err) {
            console.error('Помилка з’єднання:', err);
            setError('Сервер не відповідає. Перевір, чи запущено server.js на порту 5001');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '5% 0', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-box" style={{
                width: '90%',
                maxWidth: '420px',
                padding: '40px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Вхід у систему</h2>

                {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="email"
                        placeholder="Електронна пошта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            textAlign: 'center'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            textAlign: 'center'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="join-btn"
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            background: '#357abd',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Завантаження...' : 'Увійти'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                    Немає акаунта? <Link to="/register" style={{ color: '#4da3ff', textDecoration: 'none' }}>Зареєструватися</Link>
                </p>
            </div>
        </div>
    );
}

export default Auth;