const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/spade', userRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
