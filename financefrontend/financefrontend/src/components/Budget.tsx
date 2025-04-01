import React, { useState, useEffect } from 'react';
import axios from 'axios';

export type Budget = {
    id: number;
    category: { id: number; name: string };
    month: string;
    amount: number;
};

const Budget: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [form, setForm] = useState({
        category: 'Expense',
        month: 'January',
        amount: '',
    });
    const [error, setError] = useState<string>('');

    // Fetch budgets when component mounts
    const fetchBudgets = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/budgets');
            console.log('Budgets response:', response.data);
            const data = response.data;
            if (Array.isArray(data)) {
                setBudgets(data);
            } else if (data.budgets && Array.isArray(data.budgets)) {
                setBudgets(data.budgets);
            } else {
                console.error('Unexpected budgets response format:', data);
                setBudgets([]);
            }
        } catch (err) {
            console.error('Error fetching budgets:', err);
            setError('Error fetching budgets');
        }
    };


    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const categoryMapping: Record<string, number> = {
            Expense: 2,
            Income: 1,
        };

        const payload = {
            category: { id: categoryMapping[form.category] },
            month: form.month.toUpperCase(), // Convert to uppercase ("MARCH" instead of "March")
            amount: parseFloat(form.amount),
        };

        try {
            const response = await axios.post('http://localhost:8081/api/budgets', payload);
            setBudgets([...budgets, response.data]);
            setForm({ category: 'Expense', month: 'January', amount: '' });
        } catch (err) {
            console.error('Error creating budget:', err);
            setError('Failed to add budget. It might already exist or there is an error.');
        }
    };



    return (
        <div className="card">
            <h2>Budget Planning</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
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
                    <label>Month:</label>
                    <select
                        value={form.month}
                        onChange={(e) => setForm({ ...form, month: e.target.value })}
                    >
                        {[
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                        ].map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
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
                <button className="submit-btn" type="submit">
                    Set Budget
                </button>
            </form>
            <h3>Budget List</h3>
            {budgets.length === 0 ? (
                <p>No budgets set yet.</p>
            ) : (
                <ul>
                    {budgets.map((b) => (
                        <li key={b.id}>
                            {b.month} - {b.category.name}: ${b.amount.toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Budget;
