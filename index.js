require('dotenv').config();

//create the database from signup

const express = require('express');
const app = express();
const path = require('path');
var session = require('express-session');
const methodOverride = require("method-override");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(methodOverride("_method"));

//mysql connection
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: true
    }
});

connection.connect((err) => {
    if (err) {
        console.log('DB connection error:', err);
    } else {
        console.log('Connected to database');
    }
});

const { v4: uuidv4 } = require('uuid');
uuidv4();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app starting on port ${port}`);
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});
app.get("/signin", (req, res) => {
    res.render("signin.ejs", { error: "" });
});

//SIGNUP
app.post("/signup", (req, res) => {
    let { firstname, lastname, email, password } = req.body;
    let id = uuidv4();

    console.log(id);
    let name = firstname + " " + lastname;
    connection.query("INSERT INTO users VALUES(?,?,?,?)", [id, name, email, password], (err, result) => {
        //store the user id and email in session
        if (err) throw err;
        req.session.userId = id;
        req.session.userEmail = email;
        req.session.isSetUpComplete = false;
        req.session.isLoggedIn = false;
        console.log("added succeSfully");
        res.redirect("/setup");
    });
});

//SIGNIN
app.post("/signin", (req, res) => {
    let { email, password } = req.body;
    connection.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
        if (err) throw err;

        if (result.length == 0) {
            return res.render("signin", { error: "email not found" });
        }

        if (password == result[0].password) {
            req.session.userId = result[0].id;
            req.session.userName = result[0].name;
            req.session.isLoggedIn = true;
            res.redirect("/dashboard");
        } else {
            res.render("signin.ejs", { error: "wrong password" });
        }
    });
});

app.get("/setup", (req, res) => {
    res.render("setup.ejs");
});

app.post("/setup", (req, res) => {
    let { ownername, businessname, businesstype, tagline, address, state, city, pincode, phoneno, gstinno } = req.body;
    let userId = req.session.userId;
    console.log(userId);

    connection.query(
        `INSERT INTO businesses (user_id, owner_name, business_name, business_type, tagline, address, city, state, pincode, phone, gstin)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, ownername, businessname, businesstype, tagline, address, city, state, pincode, phoneno, gstinno],
        (err, result) => {
            if (err) throw err;
            req.session.isSetUpComplete = true;
            res.redirect("/signin");
        }
    );
});

app.get("/dashboard", (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/signin");
    }
    //   if(!req.session.isSetUpComplete){
    //     return res.redirect("/setup");
    //   }
    let id = req.session.userId;
    console.log(id);

    connection.query(`SELECT * FROM businesses WHERE 
        user_id=?`, [id], (err, result) => {
        let data = result[0];
        res.render("dashboard.ejs", { data });
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
});

app.get("/inventory", (req, res) => {
    let id = req.session.userId;
    connection.query(`SELECT * FROM products WHERE user_id=?`, [id], (err, result) => {
        if (err) throw err;
        res.render("inventory.ejs", { result });
    });
});

app.get("/inventory/new", (req, res) => {
    res.render("inventorynew.ejs");
});

app.post("/inventory/new", (req, res) => {
    let { name, category, stock, price } = req.body;
    let user_id = req.session.userId;
    console.log(user_id);
    connection.query(`INSERT INTO products (user_id,name,category,stock,price)
    VALUES (?,?,?,?,?)`, [user_id, name, category, stock, price], (err, result) => {
        if (err) throw err;
        res.redirect("/inventory");
    });
});

app.get("/inventory/edit/:id", (req, res) => {
    let { id } = req.params;
    connection.query(`SELECT * FROM products WHERE id=?`, [id], (err, result) => {
        if (err) throw err;
        let product = result[0];
        res.render("inventoryedit.ejs", { product });
    });
});

app.patch("/inventory/edit/:id", (req, res) => {
    let { id } = req.params;
    console.log(req.body);
    connection.query(`UPDATE products SET name=?,category=?,stock=?,price=? WHERE id=?`, [req.body.name, req.body.category, req.body.stock, req.body.price, id], (err, result) => {
        if (err) throw err;
        res.redirect("/inventory");
    });
});

app.delete("/inventory/delete/:id", (req, res) => {
    let { id } = req.params;
    connection.query(`DELETE FROM products WHERE id=?`, [id], (err, result) => {
        if (err) throw err;
        res.redirect("/inventory");
    });
});

//BILLING

app.get("/billing", (req, res) => {
    let id = req.session.userId;

    connection.query(`SELECT * FROM businesses WHERE user_id=?`, [id], (err, businessResult) => {
        if (err) throw err;
        let business = businessResult[0]; // the logged-in user's business
        console.log(business);

        connection.query(`SELECT * FROM products WHERE user_id=?`, [id], (err, result) => {
            if (err) throw err;
            res.render("billing.ejs", { result, business });
        });
    });
});

app.post("/billing", (req, res) => {
    let id = req.session.userId;
    const { customerName, customerPhone, items, subtotal, gst, total } = req.body;

    connection.query(
        `INSERT INTO customers (name, phone_no, user_id) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [customerName, customerPhone, id],
        (err) => {
            if (err) { console.log(err); return res.status(500).end(); }

            connection.query(
                `INSERT INTO bills (user_id, phone_no, subtotal, gst, total) VALUES (?, ?, ?, ?, ?)`,
                [id, customerPhone, subtotal, gst, total],
                (err, billResult) => {
                    if (err) { console.log(err); return res.status(500).end(); }

                    let billId = billResult.insertId;
                    let remaining = items.length;

                    items.forEach(item => {
                        connection.query(
                            `INSERT INTO bill_items (bill_id, product_id, product_name, quantity, price, total)
                             VALUES (?, ?, ?, ?, ?, ?)`,
                            [billId, item.id, item.name, item.qty, item.price, item.total],
                            (err) => {
                                if (err) console.log(err); // ok to continue here, no data dependency below

                                connection.query(
                                    `UPDATE products SET stock = stock - ? WHERE id = ?`,
                                    [item.qty, item.id],
                                    (err) => {
                                        if (err) console.log(err);

                                        remaining--;
                                        if (remaining === 0) {
                                            res.json({ message: 'Bill generated successfully' });
                                        }
                                    }
                                );
                            }
                        );
                    });
                }
            );
        }
    );
});

app.get("/history", (req, res) => {
    let id = req.session.userId;

    connection.query(`SELECT * FROM bills WHERE user_id=? ORDER BY created_at DESC`, [id], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render("history.ejs", { bills: result });
    });
});