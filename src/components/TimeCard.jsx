import React, { useState, useEffect, useRef } from 'react';
import { Clock, Globe } from 'lucide-react';
import './TimeCard.css';

const TIMEZONES = [
    { label: 'New York, USA', value: 'America/New_York' },
    { label: 'Los Angeles, USA', value: 'America/Los_Angeles' },
    { label: 'Chicago, USA', value: 'America/Chicago' },
    { label: 'Toronto, Canada', value: 'America/Toronto' },
    { label: 'Vancouver, Canada', value: 'America/Vancouver' },
    { label: 'Mexico City, Mexico', value: 'America/Mexico_City' },
    { label: 'São Paulo, Brazil', value: 'America/Sao_Paulo' },
    { label: 'London, UK', value: 'Europe/London' },
    { label: 'Paris, France', value: 'Europe/Paris' },
    { label: 'Berlin, Germany', value: 'Europe/Berlin' },
    { label: 'Madrid, Spain', value: 'Europe/Madrid' },
    { label: 'Rome, Italy', value: 'Europe/Rome' },
    { label: 'Amsterdam, Netherlands', value: 'Europe/Amsterdam' },
    { label: 'Stockholm, Sweden', value: 'Europe/Stockholm' },
    { label: 'Zurich, Switzerland', value: 'Europe/Zurich' },
    { label: 'Istanbul, Turkey', value: 'Europe/Istanbul' },
    { label: 'Moscow, Russia', value: 'Europe/Moscow' },
    { label: 'Dubai, UAE', value: 'Asia/Dubai' },
    { label: 'Riyadh, Saudi Arabia', value: 'Asia/Riyadh' },
    { label: 'Mumbai, India', value: 'Asia/Kolkata' },
    { label: 'Dhaka, Bangladesh', value: 'Asia/Dhaka' },
    { label: 'Bangkok, Thailand', value: 'Asia/Bangkok' },
    { label: 'Jakarta, Indonesia', value: 'Asia/Jakarta' },
    { label: 'Singapore', value: 'Asia/Singapore' },
    { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
    { label: 'Taipei, Taiwan', value: 'Asia/Taipei' },
    { label: 'Seoul, South Korea', value: 'Asia/Seoul' },
    { label: 'Tokyo, Japan', value: 'Asia/Tokyo' },
    { label: 'Beijing, China', value: 'Asia/Shanghai' },
    { label: 'Perth, Australia', value: 'Australia/Perth' },
    { label: 'Sydney, Australia', value: 'Australia/Sydney' },
    { label: 'Auckland, New Zealand', value: 'Pacific/Auckland' },
    { label: 'Cairo, Egypt', value: 'Africa/Cairo' },
    { label: 'Nairobi, Kenya', value: 'Africa/Nairobi' },
    { label: 'Johannesburg, South Africa', value: 'Africa/Johannesburg' },
];

const TimeCard = () => {
    const [time, setTime] = useState(new Date());
    const [selectedTimezone, setSelectedTimezone] = useState(() => (
        localStorage.getItem('selectedTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone
    ));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date, timezone) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: timezone,
        });
    };

    const getUTCOffset = (timezone) => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en', {
            timeZone: timezone,
            timeZoneName: 'shortOffset',
        });
        const parts = formatter.formatToParts(now);
        const offsetPart = parts.find((p) => p.type === 'timeZoneName');
        return offsetPart ? offsetPart.value : '';
    };

    const getDisplayLabel = () => {
        const found = TIMEZONES.find((tz) => tz.value === selectedTimezone);
        return found ? found.label : selectedTimezone;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTimezoneSelect = (timezone) => {
        setSelectedTimezone(timezone);
        localStorage.setItem('selectedTimezone', timezone);
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    const filteredTimezones = TIMEZONES.filter((tz) =>
        tz.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="stat-card time-card" ref={dropdownRef}>
            <div className="stat-info">
                <div className="time-card-header">
                    <span className="stat-label">Current Time</span>
                    <button
                        className="timezone-btn"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        title="Change timezone"
                        aria-label="Change timezone"
                    >
                        <Globe size={14} />
                    </button>
                </div>
                <span className="stat-value">{formatTime(time, selectedTimezone)}</span>
                <span className="stat-sub">{getDisplayLabel()}</span>
            </div>
            <div className="stat-icon purple">
                <Clock size={24} />
            </div>

            {isDropdownOpen && (
                <div className="timezone-dropdown">
                    <input
                        type="text"
                        className="timezone-search"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    <ul className="timezone-list">
                        {filteredTimezones.map((tz) => (
                            <li
                                key={tz.value}
                                className={`timezone-item ${selectedTimezone === tz.value ? 'selected' : ''}`}
                                onClick={() => handleTimezoneSelect(tz.value)}
                            >
                                <span className="timezone-item-label">{tz.label}</span>
                                <span className="timezone-item-offset">{getUTCOffset(tz.value)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TimeCard;
