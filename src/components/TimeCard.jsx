import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TimeCard = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const getTimeZone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

    return (
        <div className="stat-card time-card">
            <div className="stat-info">
                <span className="stat-label">Current Time</span>
                <span className="stat-value">{formatTime(time)}</span>
                <span className="stat-sub">{getTimeZone()}</span>
            </div>
            <div className="stat-icon purple">
                <Clock size={24} />
            </div>
        </div>
    );
};

export default TimeCard;
