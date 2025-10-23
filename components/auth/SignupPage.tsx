
import React, { useState, useContext } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { User } from '../../types';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext) as AuthContextType;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.some(u => u.email === email)) {
            setError('An account with this email already exists.');
            return;
        }

        const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            passwordHash: password, // In a real app, hash this password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        auth.login(newUser);
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Full Name"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div>
                    <Button type="submit">Sign Up</Button>
                </div>
            </form>
            <div className="text-sm text-center mt-4">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
