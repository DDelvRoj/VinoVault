import express from 'express';
import session from 'express-session';
import models from 'express-cassandra';

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
      migration: 'safe',
    }
  },
  function(err) {
    if(err) throw err;
  }
);

app.post('/register', (req, res) => {
  const { name, email } = req.body;

  const user = new models.instance.User({
    id: models.timeuuid(),
    name: name,
    email: email
  });

  user.save(function(err){
    if(err) {
      console.log(err);
      return res.status(500).send('An error occurred while registering the user.');
    } else {
      req.session.userId = user.id; // Guarda el ID del usuario en la sesión
      console.log('User registered successfully.');
      return res.status(200).send('User registered successfully.');
    }
  });
});

app.post('/login', (req, res) => {
  const { email } = req.body;

  models.instance.User.findOne({email: email}, function(err, user){
    if(err) {
      console.log(err);
      return res.status(500).send('An error occurred while logging in.');
    } else if (!user) {
      return res.status(400).send('No user found with this email.');
    } else {
      req.session.userId = user.id; // Guarda el ID del usuario en la sesión
      console.log('User logged in successfully.');
      return res.status(200).send('User logged in successfully.');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
