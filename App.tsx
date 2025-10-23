
import React, { useState, useCallback, useMemo } from 'react';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ScheduleAccessPage from './components/schedule/ScheduleAccessPage';
import ScheduleViewPage from './components/schedule/ScheduleViewPage';
import { User, Schedule } from './types';
import { AuthContext, AuthContextType } from './contexts/AuthContext';
import Header from './components/ui/Header';

type Page = 'login' | 'signup' | 'forgot_password' | 'schedule_access' | 'schedule_view';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);

    const getInitialPage = (): Page => {
        if (currentUser) {
            return 'schedule_access';
        }
        return 'login';
    };
    
    const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());

    const login = useCallback((user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        setCurrentPage('schedule_access');
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setActiveSchedule(null);
        setCurrentPage('login');
    }, []);

    const authContextValue: AuthContextType = useMemo(() => ({
        currentUser,
        login,
        logout,
    }), [currentUser, login, logout]);

    const handleScheduleLoad = (schedule: Schedule) => {
        setActiveSchedule(schedule);
        setCurrentPage('schedule_view');
    };

    const handleBackToAccess = () => {
        setActiveSchedule(null);
        setCurrentPage('schedule_access');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginPage onSwitchToSignup={() => setCurrentPage('signup')} onSwitchToForgotPassword={() => setCurrentPage('forgot_password')} />;
            case 'signup':
                return <SignupPage onSwitchToLogin={() => setCurrentPage('login')} />;
            case 'forgot_password':
                return <ForgotPasswordPage onSwitchToLogin={() => setCurrentPage('login')} />;
            case 'schedule_access':
                return <ScheduleAccessPage onScheduleLoaded={handleScheduleLoad} />;
            case 'schedule_view':
                return activeSchedule && <ScheduleViewPage schedule={activeSchedule} onBack={handleBackToAccess} />;
            default:
                return <LoginPage onSwitchToSignup={() => setCurrentPage('signup')} onSwitchToForgotPassword={() => setCurrentPage('forgot_password')} />;
        }
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header />
                <main className="container mx-auto p-4 md:p-8">
                    {renderPage()}
                </main>
            </div>
        </AuthContext.Provider>
    );
};

export default App;
