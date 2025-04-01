import React, { useState, useEffect } from 'react';
import axios from 'axios';

export type Transaction = {
    id: number;
    amount: number;
    date: string;
    description: string;
    category: { id: number; name: string };
    tags: string[];
    isRecurring: boolean;
};

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [form, setForm] = useState({
        amount: '',
        date: '',
        description: '',
        category: 'Income',
        tags: '',
        isRecurring: false,
    });
    const [error, setError] = useState<string>('');

    // Fetch transactions on component mount
    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/transactions');
            const data = response.data;
            if (Array.isArray(data)) {
                setTransactions(data);
            } else if (data.transactions && Array.isArray(data.transactions)) {
                setTransactions(data.transactions);
            } else {
                console.error('Unexpected response format:', data);
                setTransactions([]);
            }
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Error fetching transactions');
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Mapping for category IDs
        const categoryMapping: Record<string, number> = {
            Income: 1,
            Expense: 2,
        };

        const payload = {
            amount: parseFloat(form.amount),
            date: form.date,
            description: form.description,
            category: { id: categoryMapping[form.category] },
            tags: form.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag !== ''),
            isRecurring: form.isRecurring,
        };

        try {
            const response = await axios.post('/api/transactions', payload);
            setTransactions([...transactions, response.data]);
            setForm({
                amount: '',
                date: '',
                description: '',
                category: 'Income',
                tags: '',
                isRecurring: false,
            });
        } catch (err) {
            console.error('Error creating transaction:', err);
            setError('Failed to add transaction');
        }
    };

    return (
        <div className="card">
            <h2>Record Income & Expenses</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Tags (comma separated):</label>
                    <input
                        type="text"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={form.isRecurring}
                            onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
                        />
                        Recurring
                    </label>
                </div>
                <button className="submit-btn" type="submit">
                    Record Transaction
                </button>
            </form>
            <h3>Transactions List</h3>
            {transactions.length === 0 ? (
                <p>No transactions recorded yet.</p>
            ) : (
                <ul>
                    {transactions.map((t) => (
                        <li key={t.id}>
                            <strong>{t.date}</strong>: {t.description} - ${t.amount.toFixed(2)} ({t.category?.name || 'Unknown Category'})
                            {t.isRecurring && ' [Recurring]'}
                            {t.tags.length > 0 && ` Tags: ${t.tags.join(', ')}`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Transactions;
