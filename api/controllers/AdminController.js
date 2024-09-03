const express = require("express");
const app = express();
const AdminModel = require("../models/AdminModel");
const jwt = require("jsonwebtoken");
const service = require("./Service");

app.post("/admin/signin", async (req, res) => {
  try {
    const admin = await AdminModel.findOne({
      where: {
        usr: req.body.usr,
        pwd: req.body.pwd,
      },
    });

    if (admin != null) {
      let token = jwt.sign({ id: admin.id }, process.env.secret);
      res.send({ token: token, message: "success" });
    } else {
      res.statusCode = 401;
      res.send({ message: "not found" });
    }
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/admin/info", service.isLogin, async (req, res, next) => {
  try {
    const adminId = service.getAdminId(req);
    const admin = await AdminModel.findByPk(adminId, {
      attributes: ["id", "name", "level", "usr"],
    });

    res.send({ result: admin, message: "success" });
  } catch (e) {
    res.statusCode = 500;
    return res.send({ message: e.message });
  }
});

app.post("/admin/create", service.isLogin, async (req, res) => {
  try {
    await AdminModel.create(req.body);
    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.get("/admin/list", service.isLogin, async (req, res) => {
  try {
    const results = await AdminModel.findAll({
      attributes: ["email", "name", "usr", "level", "id"],
    });
    res.send({ message: "success", results: results });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.delete("/admin/delete/:id", service.isLogin, async (req, res) => {
  try {
    await AdminModel.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.post("/admin/edit/:id", service.isLogin, async (req, res) => {
  try {
    await AdminModel.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

app.post("/admin/changeProfile", service.isLogin, async (req, res) => {
  try {
    await AdminModel.update(req.body, {
      where: {
        id: req.body.id,
      },
    });

    res.send({ message: "success" });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

module.exports = app;
