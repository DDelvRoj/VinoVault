import express from 'express';
import session from 'express-session';
import models from 'express-cassandra';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

declare module 'express-session' {
    export interface SessionData {
      userId: any; // Añade las propiedades de la sesión aquí
    }
}

declare module 'express' {
    export interface Request {
      session: session.SessionData;
    }
}

const app = express();
app.use(express.json());

// Configuración de express-session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Recuerda cambiar esto a true si estás en un entorno de producción con HTTPS habilitado
}));

// Configuración de express-cassandra
models.setDirectory( __dirname + '/models').bind(
  {
    clientOptions: {
      contactPoints: ['172.18.95.214'],
      protocolOptions: { port: 9042 },
      keyspace: 'mykeyspace',
      queryOptions: {consistency: models.consistencies.one}
    },
    ormOptions: {
      defaultReplicationStrategy : {
        class: 'SimpleStrategy',
        replication_factor: 1
      },
      migration: 'alter',
    }
  },
  function(err) {
    if(err) throw err;
  }
);

const User = models.loadSchema('User', {
  fields: {
    id: 'timeuuid',
    name: 'text',
    password: 'text',
  },
  key: ['id']
});

app.post('/register', 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new models.instance.User({
      id: models.timeuuid(),
      name: name,
      password: hashedPassword
    });

    user.save(function(err){
      if(err) {
        console.log(err);
        return res.status(500).send('An error occurred while registering the user.');
      } else {
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');
        console.log('User registered successfully.');
        return res.status(200).json({ message: 'User registered successfully.', token: token });
      }
    });
});

app.post('/login', 
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('password').notEmpty().withMessage('Password is required')
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    models.instance.User.findOne({name: name}, async function(err, user){
      if(err) {
        console.log(err);
        return res.status(500).send('An error occurred while logging in.');
      } else if (!user) {
        return res.status(400).send('No user found with this name.');
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(400).send('Incorrect password.');
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');
        console.log('User logged in successfully.');
        return res.status(200).json({ message: 'User logged in successfully.', token: token });
      }
    });
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.get('/protected', authenticateJWT, (req, res) => {
    res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
