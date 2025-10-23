
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // This is a simulation. In a real app, you would send an email.
        setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
        setEmail('');
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
            {message && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-sm text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
                <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div>
                    <Button type="submit">Send Reset Link</Button>
                </div>
            </form>
            <div className="text-sm text-center mt-4">
                <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
