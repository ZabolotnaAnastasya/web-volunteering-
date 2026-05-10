import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <header>
            <div className="header-container">
                <h1>Я - волонтер:</h1>
                <nav>
                    <ul>
                        <li><Link to="/about">Про нас</Link></li>
                        <li><Link to="/">Ініціативи</Link></li>
                        <li><Link to="/my-initiatives">Мої ініціативи</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;