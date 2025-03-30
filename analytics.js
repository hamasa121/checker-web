import { DISCORD_WEBHOOK_URL, STORAGE_KEYS } from './config.js';

// Initialize analytics in localStorage
export function initAnalytics() {
    for (const key of Object.values(STORAGE_KEYS)) {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, '0');
        }
    }
}

// Increment a specific counter
export function incrementCounter(key) {
    const currentValue = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (currentValue + 1).toString());
    return currentValue + 1;
}

// Get all analytics data
export function getAnalytics() {
    const data = {};
    for (const [name, key] of Object.entries(STORAGE_KEYS)) {
        data[name] = parseInt(localStorage.getItem(key) || '0');
    }
    return data;
}

// Send Discord webhook for new visitor
export async function notifyDiscordNewVisitor() {
    const totalVisitors = incrementCounter(STORAGE_KEYS.TOTAL_VISITORS);
    
    const embed = {
        title: "🌟 New Visitor on Discord Token Checker",
        color: 0x3b82f6, // Primary blue color
        fields: [
            {
                name: "Total Visitors",
                value: totalVisitors.toString(),
                inline: true
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: "Black Team Token Checker"
        }
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });
    } catch (error) {
        console.error('Failed to send Discord webhook:', error);
    }
}