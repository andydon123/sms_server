const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/BaseAPI/1_0/Owners', async (req, res) => {
    const user_phone = req.query.user_phone;

    if (!user_phone) {
        return res.status(400).json({ error: 'user_phone is required' });
    }

    // Генерируем 4-значный код
    const input_code = String(Math.floor(1000 + Math.random() * 9000));

    try {
        // Отправляем СМС через iqsms.ru
        await axios.post('https://api.iqsms.ru/messages/v2/send.json', {
            login: 'z1629266838562',
            password: '254475',
            messages: [
        {
            phone: user_phone,
            text: `Ваш код подтверждения: ${input_code}`,
            sender: 'MediaGramma',
            clientId: Date.now().toString()
        }
    ]
});

        return res.json({
            user_phone: user_phone,
            input_code: input_code,
            status: 'ok'
        });

    } catch (err) {
        return res.status(500).json({
            error: 'SMS send failed',
            details: err.message
        });
    }
});

// Для локального запуска
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
