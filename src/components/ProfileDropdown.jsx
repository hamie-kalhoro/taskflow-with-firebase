import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
    Moon,
    Sun,
    Shield,
    Bell
} from 'lucide-react';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const isDarkMode = theme === 'dark';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Get user initials for avatar placeholder
    const getInitials = () => {
        if (user?.displayName) {
            return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return 'U';
    };

    // Get display name
    const getDisplayName = () => {
        if (user?.displayName) return user.displayName;
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    return (
        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                className="profile-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {user?.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="profile-avatar"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="profile-avatar-placeholder">
                        {getInitials()}
                    </div>
                )}
                <ChevronDown
                    size={16}
                    className={`profile-chevron ${isOpen ? 'open' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div
                        className="profile-dropdown-backdrop"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={`profile-dropdown-menu ${isOpen ? 'open' : ''}`}>
                        {/* User Info Section */}
                        <div className="profile-user-section">
                            <div className="profile-user-header">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        className="profile-user-avatar"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="profile-user-avatar-placeholder">
                                        {getInitials()}
                                    </div>
                                )}
                                <div className="profile-user-details">
                                    <div className="profile-user-name">{getDisplayName()}</div>
                                    <div className="profile-user-email">{user?.email}</div>
                                </div>
                            </div>
                            <div className="profile-badge">
                                <Shield size={12} />
                                Free Plan
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="profile-menu-section">
                            <button className="profile-menu-item">
                                <User size={18} className="menu-icon" />
                                My Profile
                            </button>
                            <button className="profile-menu-item">
                                <Settings size={18} className="menu-icon" />
                                Settings
                            </button>
                            <button className="profile-menu-item">
                                <Bell size={18} className="menu-icon" />
                                Notifications
                            </button>
                        </div>

                        <div className="profile-menu-divider" />

                        {/* Theme Toggle */}
                        <div className="profile-menu-section">
                            <button
                                className="profile-theme-toggle"
                                onClick={toggleTheme}
                            >
                                <span className="profile-theme-toggle-label">
                                    {isDarkMode ? (
                                        <Moon size={18} className="menu-icon" />
                                    ) : (
                                        <Sun size={18} className="menu-icon" />
                                    )}
                                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                                </span>
                                <div className={`theme-switch ${isDarkMode ? 'active' : ''}`}>
                                    <div className="theme-switch-handle" />
                                </div>
                            </button>
                        </div>

                        <div className="profile-menu-divider" />

                        <div className="profile-menu-section">
                            <button className="profile-menu-item">
                                <HelpCircle size={18} className="menu-icon" />
                                Help & Support
                            </button>
                            <button
                                className="profile-menu-item logout"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} className="menu-icon" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileDropdown;
