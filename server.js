const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
var bcrypt = require("bcryptjs");
const app = express();

var corsOptions = {
  origin: "*"
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Register = require("./app/blockchain/businesses/Register");
const Role = db.role;
const User = db.user;
app.use(express.static('public'))
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
    await Register.Initial()
    await Register.user('integrate')
    await Register.user('oildepot')
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            const Register = require('./app/blockchain/businesses/Register')
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "integrate"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'integrate' to roles collection");
                const user = new User({
                    username: 'integrate',
                    email: 'integrate@gmail.com',
                    password: bcrypt.hashSync('helloworld', 8)
                });

                Role.find(
                    {
                        name: {$in: ['integrate']}
                    },
                    (err, roles) => {
                        if (err) {
                            console.log(err)
                        }
                        user.roles = roles.map(role => role._id);
                        user.save((err, user) => {
                            if (err) {
                                console.log("Failed to create user 'integrate' with default password", err);
                            }
                            console.log("create user 'integrate' with default password");
                        })
                    }
                );


            });

            new Role({
                name: "oildepot"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'oildepot' to roles collection");

                const user = new User({
                    username: 'oildepot',
                    email: 'oildepot@gmail.com',
                    password: bcrypt.hashSync('helloworld', 8)
                });

                Role.find(
                    {
                        name: {$in: ['oildepot']}
                    },
                    (err, roles) => {
                        if (err) {
                            console.log(err)
                        }
                        user.roles = roles.map(role => role._id);
                        user.save((err, user) => {
                            if (err) {
                                console.log("Failed to create user 'oildepot' with default password", err);
                            }
                            console.log("create user 'oildepot' with default password");
                        })
                    }
                );


            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");

                const user = new User({
                    username: 'admin',
                    email: 'admin@gmail.com',
                    password: bcrypt.hashSync('helloworld', 8)
                });

                Role.find(
                    {
                        name: {$in: ['admin']}
                    },
                    (err, roles) => {
                        if (err) {
                            console.log(err)
                        }
                        user.roles = roles.map(role => role._id);
                        user.save((err, user) => {
                            if (err) {
                                console.log("Failed to create user 'admin' with default password", err);
                            }
                            console.log("create user 'admin' with default password");
                        })
                    }
                );


            });
        }
    });
}
