const express = require('express');
const app = express();

const PORT = 9000;

app.use(express.json());

app.get('/', (req, res) => {
    const { name } = req.body;
    res.json({ message: `Hello ${name}` });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

