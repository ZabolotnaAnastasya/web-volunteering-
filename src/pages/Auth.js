import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) navigate('/my-initiatives');
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setLoading(false);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                alert("Невірний email або пароль.");
            } else if (error.code === 'auth/user-not-found') {
                alert("Користувача з таким email не знайдено.");
            } else {
                alert("Помилка входу: " + error.message);
            }
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
                    Вхід у систему
                </h2>
                <form onSubmit={handleLogin} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <input
                        type="email"
                        placeholder="Ваш Email"
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
                            marginBottom: '4%'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
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
                            marginBottom: '5%'
                        }}
                    />
                    <button
                        type="submit"
                        className="join-btn"
                        disabled={loading}
                        style={{ width: '80%', margin: 0 }}
                    >
                        {loading ? 'Завантаження...' : 'Увійти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;