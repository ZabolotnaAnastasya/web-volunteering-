import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) navigate('/my-initiatives');
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.email), {
                name: displayName,
                email: user.email,
                joinedInitiatives: [],
                createdAt: new Date()
            });
            // редирект через useEffect вище
        } catch (error) {
            setLoading(false);
            if (error.code === 'auth/email-already-in-use') {
                alert("Цей email вже зареєстрований. Спробуйте увійти.");
            } else if (error.code === 'auth/weak-password') {
                alert("Пароль надто короткий. Мінімум 6 символів.");
            } else {
                alert("Помилка: " + error.message);
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
                    Реєстрація
                </h2>
                <form onSubmit={handleRegister} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <input
                        type="text"
                        placeholder="Ваше ім'я"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
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
                            marginBottom: '4%'
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
                            marginBottom: '5%'
                        }}
                    />
                    <button
                        type="submit"
                        className="join-btn"
                        disabled={loading}
                        style={{ width: '80%', margin: 0 }}
                    >
                        {loading ? 'Завантаження...' : 'Зареєструватися'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;