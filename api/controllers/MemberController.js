const express = require("express");
const MemberModel = require("../models/MemberModel");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const service = require("./Service");
const PackageModel = require("../models/PackageModel");

app.post("/member/signin", async (req, res) => {
  try {
    const member = await MemberModel.findAll({
      where: {
        phone: req.body.phone,
        pass: req.body.pass,
      },
    });

    if (member.length > 0) {
      let token = jwt.sign({ id: member[0].id }, process.env.secret);
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

app.get("/member/info", service.isLogin, async (req, res, next) => {
  try {
    MemberModel.belongsTo(PackageModel);

    const payLoad = jwt.decode(service.getToken(req));
    const member = await MemberModel.findByPk(payLoad.id, {
      attributes: ["id", "name"],
      include: [
        {
          model: PackageModel,
          attributes: ["name", "bill_amount"],
        },
      ],
    });

    res.send({ result: member, message: "success" });
  } catch (e) {
    res.statusCode = 500;
    return res.send({ message: e.message });
  }
});

app.put("/member/changeProfile", service.isLogin, async (req, res) => {
  try {
    const memberId = service.getMemberId(req);
    const payload = {
      name: req.body.memberName,
    };
    const result = await MemberModel.update(payload, {
      where: {
        id: memberId,
      },
    });

    res.send({ message: "success", result: result });
  } catch (e) {
    res.statusCode = 500;
    return res.send({ message: e.message });
  }
});

app.get("/member/list", service.isLogin, async (req, res) => {
  try {
    const PackageModel = require("../models/PackageModel");
    MemberModel.belongsTo(PackageModel);

    const results = await MemberModel.findAll({
      order: [["id", "DESC"]],
      attributes: ["id", "name", "phone", "createdAt"],
      include: {
        model: PackageModel,
      },
    });

    res.send({ message: "success", results: results });
  } catch (e) {
    res.statusCode = 500;
    res.send({ message: e.message });
  }
});

module.exports = app;
