import React, { useState, useEffect } from 'react';
import './App.css';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import Investments from './components/Investments';
import Calculator from './components/Calculator';
import Calendar from './components/Calendar.tsx';
import Notes from './components/Notes';
import { FaSun, FaMoon, FaCalculator, FaCalendarAlt, FaStickyNote } from 'react-icons/fa';

type ActiveTab = 'transactions' | 'budget' | 'investments' | 'calendar' | 'notes';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('transactions');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [showCalculator, setShowCalculator] = useState<boolean>(false);

    // Update the <body> class based on the theme
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const toggleCalculator = () => {
        setShowCalculator(prev => !prev);
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                {/* Theme Toggle at the Top */}
                <div className="theme-toggle" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <button className="icon-btn" onClick={toggleTheme}>
                        {theme === 'dark' ? <FaSun size={24} /> : <FaMoon size={24} />}
                    </button>
                </div>

                <h2 className="sidebar-title">Menu</h2>
                <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'transactions' ? 'active' : ''}
                        onClick={() => setActiveTab('transactions')}
                    >
                        Transactions
                    </button>
                    <button
                        className={activeTab === 'budget' ? 'active' : ''}
                        onClick={() => setActiveTab('budget')}
                    >
                        Budget
                    </button>
                    <button
                        className={activeTab === 'investments' ? 'active' : ''}
                        onClick={() => setActiveTab('investments')}
                    >
                        Investments
                    </button>
                    <button
                        className={activeTab === 'calendar' ? 'active' : ''}
                        onClick={() => setActiveTab('calendar')}
                    >
                        <FaCalendarAlt size={16} style={{ marginRight: '0.5rem' }} />
                        Calendar
                    </button>
                    <button
                        className={activeTab === 'notes' ? 'active' : ''}
                        onClick={() => setActiveTab('notes')}
                    >
                        <FaStickyNote size={16} style={{ marginRight: '0.5rem' }} />
                        Notes
                    </button>
                </nav>

                {/* Calculator Toggle */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button className="icon-btn" onClick={toggleCalculator}>
                        <FaCalculator size={24} />
                        <span style={{ marginLeft: '0.5rem' }}>
              {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
            </span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <h1>Personal Finance App</h1>
                </header>
                <section className="content">
                    {activeTab === 'transactions' && <Transactions />}
                    {activeTab === 'budget' && <Budget />}
                    {activeTab === 'investments' && <Investments />}
                    {activeTab === 'calendar' && <Calendar />}
                    {activeTab === 'notes' && <Notes />}
                </section>
                {showCalculator && <Calculator />}
            </main>
        </div>
    );
};

export default App;
