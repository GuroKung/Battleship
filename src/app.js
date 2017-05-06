import express from 'express';
import bodyParser from 'body-parser';

import apiRoute from '../routes/api';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', apiRoute);

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
