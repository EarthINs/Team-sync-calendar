
import React, { useContext } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { Button } from './Button';

const Header: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block mr-2 -mt-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Team Sync Calendar
                </h1>
                {auth.currentUser && (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 hidden sm:block">Welcome, {auth.currentUser.name}!</span>
                        <Button onClick={auth.logout} variant="secondary">Logout</Button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
