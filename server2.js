const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mysql');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const con = sql.createConnection(
  {
    host : 'database-2.c7gs8uw62z91.eu-north-1.rds.amazonaws.com',
    user : 'admin',
    password : 'rootadmin',
    database : 'gas_agency',
    port : 3306
  }
);

con.connect((err)=>{
  if(err) throw err;
  console.log('Connected');
});

app.get('/users', async(req,res) =>{
    try{
        
        con.query('SELECT * FROM users',async (err,result)=>{
            if(err)
              return res.status(500).json({error : err});

            res.status(200).json(result);
        });
    }catch(err){
      res.status(500).json({error : err});
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const q = 'SELECT * FROM users WHERE email = ?';
    
    con.query(q, [email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result[0];

        if (user.password === password) {
            return res.status(200).json({ id: user.userId });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.post("/user-registration", (req, res) => {
    const { name, phonenumber, email, address, password } = req.body;

    // Check if email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    con.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error("Error checking email existence:", err);
            return res.status(500).json({ error: "Database error, please try again later." });
        }

        if (results.length > 0) {
            // Email already exists, return error response
            return res.status(400).json({ error: "Email already registered. Please use a different email." });
        }

        // If email does not exist, insert new user
        const insertQuery = "INSERT INTO users (name, phonenumber, email, address, password) VALUES (?, ?, ?, ?, ?)";
        con.query(insertQuery, [name, phonenumber, email, address, password], (err, insertResults) => {
            if (err) {
                console.error("Error during registration:", err);
                return res.status(500).json({ error: "Database error, please try again later." });
            }

            console.log("Registration successful:", insertResults);
            res.status(201).json({ message: "User registered successfully!", userId: insertResults.insertId });
        });
    });
});

app.get("/get-user", (req, res) => {
    const { customerId } = req.query;  // Get customerId from query params
    const sql = "SELECT name, address, phonenumber, userId FROM users WHERE userId = ?";
 
    con.query(sql, [customerId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result[0]); // Return user data
    });
});

// ✅ 2️⃣ Update Address or Phone API
app.post("/update-user", (req, res) => {
    const { customerId, field, value } = req.body;

    if (!["address", "phone"].includes(field)) {
        return res.status(400).json({ error: "Invalid field" });
    }

    const sql = `UPDATE users SET ${field} = ? WHERE userId = ?`;
    con.query(sql, [value, customerId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Update failed" });
        }
        res.json({ success: true, message: `${field} updated successfully` });
    });
});

app.post("/mybookings", async (req, res) => {
    const { customerId } = req.body;
  
    if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
    }

    const q = `SELECT * FROM bookings WHERE customerId = ?`;

    con.query(q, [customerId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });  // ✅ Ensure early return on error
        }
        return res.status(200).json({ results: results });  // ✅ Return to prevent further execution
    });
});

app.get("/allbookings", (req, res) => {
    const query = "SELECT * FROM bookings";
    con.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err });
      }
      res.status(200).json({ results });
    });
  });

  app.post("/allowAddon", (req, res) => {
    const { bookingId } = req.body;
  
    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }
  
    const query = "UPDATE bookings SET addons = 1 WHERE bookingId = ?";
    con.query(query, [bookingId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Booking not found" });
      }
  
      res.status(200).json({ message: "Add-on allowed successfully" });
    });
  });


// ✅ 3️⃣ Cylinder Booking API
app.post("/book-cylinder", (req, res) => {
    const { customerId, cylinderType, address, phone } = req.body;
    let amoumnt = 0.0;
    switch(cylinderType){
        case 'Standard' :
            amoumnt = 1000.00
        break;
            case 'Premium' : 
            amoumnt = 3500.00
        break;
            case 'Industrial' :
                amoumnt = 1500.00
            break;

        default:
            amoumnt = 1500.00;
    }

    const sql = "INSERT INTO bookings (customerId, cylinderType, address, phone, amount, bookingDate) VALUES (?, ?, ?, ?, ?, NOW())";
    con.query(sql, [customerId, cylinderType, address, phone, amoumnt], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Booking failed" });
        }
        res.json({ success: true, message: "Cylinder booked successfully", bookingId: result.insertId });
    });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});