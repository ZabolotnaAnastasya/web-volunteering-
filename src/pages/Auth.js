import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Ви успішно увійшли!");
            navigate('/my-initiatives'); // Перенаправляємо в кабінет
        } catch (error) {
            alert("Помилка входу: " + error.message);
        }
    };

    return (
        <div className="auth-page" style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-box" style={{ maxWidth: '400px', width: '100%' }}>
                <h2>Вхід у систему</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input
                        type="email"
                        placeholder="Ваш Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="filter-btn"
                        style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', width: '100%' }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="filter-btn"
                        style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', width: '100%' }}
                    />
                    <button type="submit" className="join-btn">Увійти</button>
                </form>
            </div>
        </div>
    );
};

export default Auth;