
import React, { useState, useContext } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { User } from '../../types';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onSwitchToForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext) as AuthContextType;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.passwordHash === password);

        if (user) {
            auth.login(user);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Button type="submit">Sign In</Button>
                </div>
            </form>
            <div className="text-sm text-center mt-4">
                <button onClick={onSwitchToForgotPassword} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                </button>
            </div>
            <div className="text-sm text-center mt-2">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignup} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
