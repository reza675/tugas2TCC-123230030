const express = require("express");
const sequelize = require("./config/database");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const cors = require("cors");

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Notes API is running");
});

require("./schema/Note");
app.use("/api/v1/notes", noteRoutes);

const port = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
