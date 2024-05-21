require("dotenv").config();
const express = require('express');

const bodyParser = require('body-parser');
const { Sequelize,DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});


//console.log(process.env.DB_URL)
sequelize.authenticate()
  .then(() => {
    console.log('Conectado')
  })
  .catch(err => {
    console.log(err)
  })

//TABLAS
const Usuarios = sequelize.define("Usuarios",{
    usuarioID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    mensaje:{
        type: DataTypes.STRING,
        allowNull: false,
    },
});





sequelize.sync({force: false})
  .then(() => {
    console.log('User table created successfully.');
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

// ruta de datos del formulario
app.post('/datos',(req,res)=>{
    var nombre = req.body.name;
    var email = req.body.email;
    var mensaje = req.body.message;
    console.log(nombre);
    Usuarios.create({
    nombre: `${nombre}`,
    email: `${email}`,
    mensaje: `${mensaje}`,
  }).then(usuario => {
    console.log('User created:', usuario.toJSON());
  }).catch(err => {
    console.error('Error creating user:', err);
  });
  
  res.send('datos enviados')
});



  //leer datos de la base de datos y enviarlos a la ruta /registros para ser mostrada en el lado del cliente
  app.get('/registros',(req,res)=>{
      const getAllUsers = async () => {
        try {
        const users = await Usuarios.findAll();
        console.log('Todos los usuarios:', users.map(user => user.toJSON()));
        res.json(users);
       } catch (error) {
        console.error('Error fetching users:', error);
        }
      };
      getAllUsers();
  });
  
  
 
  


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});