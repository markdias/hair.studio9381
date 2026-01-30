import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { stylist, service, date, time, name, email, phone } = req.body;

    if (!date || !time || !name || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for credentials
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!privateKey || !clientEmail || !calendarId) {
        console.warn('Google Calendar credentials not configured. Simulating success.');
        return res.status(200).json({
            success: true,
            message: 'Simulated booking. Configure credentials in Vercel to sync with Google Calendar.'
        });
    }

    try {
        const auth = new google.auth.JWT(
            clientEmail,
            null,
            privateKey.replace(/\\n/g, '\n'),
            SCOPES
        );

        const calendar = google.calendar({ version: 'v3', auth });

        const startDateTime = new Date(`${date}T${time}:00`).toISOString();
        const endDateTime = new Date(new Date(`${date}T${time}:00`).getTime() + 60 * 60 * 1000).toISOString();

        const event = {
            summary: `[938] ${service} - ${name}`,
            description: `Stylist: ${stylist?.name || 'Any'}\nService: ${service}\nPhone: ${phone}\nEmail: ${email}`,
            start: {
                dateTime: startDateTime,
                timeZone: 'Europe/London',
            },
            end: {
                dateTime: endDateTime,
                timeZone: 'Europe/London',
            },
            attendee: [
                { email: email }
            ]
        };

        const response = await calendar.events.insert({
            calendarId,
            resource: event,
        });

        return res.status(200).json({ success: true, eventId: response.data.id });
    } catch (error) {
        console.error('Calendar API Error:', error);
        return res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
}
