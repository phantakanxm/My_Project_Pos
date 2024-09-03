const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use(require("./controllers/PackageController"));
app.use(require("./controllers/MemberController"));
app.use(require("./controllers/ProductController"));
app.use(require("./controllers/ProductImageController"));
app.use(require("./controllers/UserController"));
app.use(require("./controllers/BillSaleController"));
app.use(require("./controllers/StockController"));
app.use(require("./controllers/BankController"));
app.use(require("./controllers/AdminController"));
app.use(require("./controllers/ChangePackageController"));

app.listen(port, () => {
    console.log(`Example app listening on port `, port);
});