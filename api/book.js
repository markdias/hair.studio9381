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

    // As per user request, we are NOT creating a Google Calendar event.
    // This endpoint now simply returns a success response to the frontend 
    // to trigger the confirmation UI. 

    return res.status(200).json({
        success: true,
        message: 'Booking received successfully (Calendar sync disabled by choice).'
    });
}
