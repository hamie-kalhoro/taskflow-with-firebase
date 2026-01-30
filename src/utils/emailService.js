import emailjs from '@emailjs/browser';

/**
 * EmailJS Service
 * Sends emails directly from the frontend using EmailJS
 */

export const sendWelcomeEmail = async (userEmail, userName) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        console.warn('EmailJS credentials missing in .env. Skipping email.');
        return;
    }

    const templateParams = {
        to_name: userName || userEmail.split('@')[0],
        to_email: userEmail,
        app_link: 'https://taskmanager-by-hmd.web.app/dashboard'
    };

    try {
        await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
        );

        console.log('✅ Welcome email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ EmailJS Error:', error);
        return false;
    }
};
