import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Investment = {
    id: number;
    name: string;
    amount: number;
    type: string;
};

const Investments: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [form, setForm] = useState({
        name: '',
        amount: '',
        type: '',
    });
    const [error, setError] = useState<string>('');

    // Fetch investments on mount
    const fetchInvestments = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/investments');
            setInvestments(response.data);
        } catch (error) {
            console.error('Error fetching investments:', error);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Construct investment payload
        const payload = {
            name: form.name,
            amount: parseFloat(form.amount),
            type: form.type,
        };

        try {
            const response = await axios.post('http://localhost:8081/api/investments', payload);
            setInvestments([...investments, response.data]);
            setForm({ name: '', amount: '', type: '' });  // Reset form
        } catch (error) {
            console.error('Error adding investment:', error);
            setError('Failed to add investment');
        }
    };

    return (
        <div className="card">
            <h2>Investments</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Form for adding investments */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Type:</label>
                    <input
                        type="text"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Investment</button>
            </form>

            {/* Displaying existing investments */}
            <h3>Current Investments</h3>
            {investments.length === 0 ? (
                <p>No investments found.</p>
            ) : (
                <ul>
                    {investments.map((investment) => (
                        <li key={investment.id}>
                            <strong>{investment.name}</strong>: ${investment.amount.toFixed(2)} ({investment.type})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Investments;
