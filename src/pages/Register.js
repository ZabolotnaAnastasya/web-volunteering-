import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // + юзер
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name: displayName,
                email: user.email,
                createdAt: new Date()
            });

            alert("Профіль створено! Вітаємо, " + displayName);
            navigate('/my-initiatives');
        } catch (error) {
            alert("Помилка: " + error.message);
        }
    };

    return (
        <div className="auth-page" style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-box" style={{ maxWidth: '400px', width: '100%' }}>
                <h2>Реєстрація</h2>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Ваше ім'я"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="filter-btn"
                        style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', width: '100%' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="filter-btn"
                        style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', width: '100%' }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль (від 6 символів)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="filter-btn"
                        style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left', width: '100%' }}
                    />
                    <button type="submit" className="join-btn">Зареєструватися</button>
                </form>
            </div>
        </div>
    );
};

export default Register;