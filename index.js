const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./models/database");
// const multer = require('multer');
const path = require("path");
const { Op } = require("sequelize");
const pharstaff = require("./models/pharstaff");
const { error } = require("console");

// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // CommonJS import

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));
app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/p/regis.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/p/newreg.html");
});

app.get("/phdash", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: {
      mobile: user,
    },
  });
  const values = await db.appointment.findAll();
  var arr = [];
  for (var i = 0; i < Object.keys(values).length; i++) {
    const info = await db.patient.findOne({
      where: {
        mobile: values[i].pat_id,
      },
    });
    arr.push(info);
  }
  res.render(__dirname + "/p/phardash", {
    name: details.name,
    obj: values,
    inf: arr,
  });
});

app.get("/phin", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: { mobile: user },
  });
  const values = await db.inven.findAll();
  res.render(__dirname + "/p/phain", { name: details.name, obj: values });
});

app.get("/phor", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: {
      [Op.or]: [{ email: user }, { mobile: user }],
    },
  });
  const values = await db.appointment.findAll();
  var arr = [];
  for (var i = 0; i < Object.keys(values).length; i++) {
    const info = await db.patient.findOne({
      where: {
        mobile: values[i].pat_id,
      },
    });
    arr.push(info);
  }
  res.render(__dirname + "/p/phord", {
    name: details.name,
    obj: values,
    inf: arr,
  });
});

// staff dash
app.get("/staffdash", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: {
      mobile: user,
    },
  });
  const values = await db.appointment.findAll();
  res.render(__dirname + "/p/staffdash", {
    name: details.name,
    obj: values,
  });
});

app.get("/appointmentlist", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: { mobile: user },
  });
  const values = await db.appointment.findAll();
  const doctor = await db.doctor.findAll();
  res.render(__dirname + "/p/appointmentlist", {
    name: details.name,
    obj: values,
    obj1: doctor,
  });
});

app.get("/doc_avail", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: {
      [Op.or]: [{ email: user }, { mobile: user }],
    },
  });
  const values = await db.doctor.findAll();
  res.render(__dirname + "/p/doc_avail", {
    name: details.name,
    obj: values,
  });
});

app.post("/login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  const details = await db.pharstaff.findOne({
    where: {
      // password,
      [Op.or]: [{ email: user }, { mobile: user }],
      // console.log(details);
    },
  });
  console.log(details);
  if (details == null) {
    res.sendFile(__dirname + "/p/regis.html");
  } else {
    if (details.password == password) {
      res.cookie("user", details.mobile);
      if (details.role == "Pharmacy Staff") {
        const values = await db.appointment.findAll();
        var arr = [];
        for (var i = 0; i < Object.keys(values).length; i++) {
          const info = await db.patient.findOne({
            where: {
              mobile: values[i].pat_id,
            },
          });
          arr.push(info);
        }
        res.render(__dirname + "/p/phardash", {
          name: details.name,
          obj: values,
          inf: arr,
        });
      } else {
        const values = await db.appointment.findAll();
        res.render(__dirname + "/p/staffdash", {
          name: details.name,
          obj: values,
        });

        // res.render(__dirname + "/p/staffdash", {
        //   name: details.name,
        // });
      }
    } else {
      // console.log(password, details.password);
      res.sendFile(__dirname + "/p/regis.html");
    }
  }
});

app.post("/registration", async (req, res) => {
  const ps_details = {
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    gender: req.body.gender,
    role: req.body.role,
  };
  const pharstaff = await db.pharstaff.create(ps_details);
  res.sendFile(__dirname + "/p/regis.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/p/index.html");
});

// inventory medicine add
app.post("/addin", async (req, res) => {
  const ps_details = {
    med_id: req.body.med_id,
    med_name: req.body.med_name,
    med_qty: req.body.med_qty,
    med_price: req.body.med_price,
  };
  const inven = await db.inven.create(ps_details);
  const details = await db.pharstaff.findOne({
    where: {
      mobile: req.cookies.user,
    },
  });
  const values = await db.inven.findAll();
  res.render(__dirname + "/p/phain", { name: details.name, obj: values });
});

app.post("/delete", async (req, res) => {
  await db.inven.destroy({
    where: {
      med_id: req.body.med_id,
    },
  });
  const details = await db.pharstaff.findOne({
    where: {
      mobile: req.cookies.user,
    },
  });
  const values = await db.inven.findAll();
  res.render(__dirname + "/p/phain", { name: details.name, obj: values });
});

//Patient
app.get("/p_login", (req, res) => {
  res.sendFile(__dirname + "/p/patlogin.html");
});

app.get("/p_register", (req, res) => {
  res.sendFile(__dirname + "/p/patreg.html");
});
app.post("/p_registration", async (req, res) => {
  const ps_details = {
    name: req.body.name,
    mobile: req.body.mobile,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    gender: req.body.gender,
  };
  const patient = await db.patient.create(ps_details);
  res.sendFile(__dirname + "/p/patlogin.html");
});

app.post("/p_login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  const details = await db.patient.findOne({
    where: {
      // password,
      [Op.or]: [{ email: user }, { mobile: user }],
      // console.log(details);
    },
  });
  console.log(details);
  if (details == null) {
    res.sendFile(__dirname + "/p/patreg.html");
  } else {
    if (details.password == password) {
      const values = await db.appointment.findAll({
        where: {
          pat_id: details.mobile,
        },
      });
      res.cookie("user", details.mobile);
      res.render(__dirname + "/p/patientdash", {
        name: details.name,
        obj: values,
      });
    } else {
      // console.log(password, details.password);
      res.sendFile(__dirname + "/p/patlogin.html");
    }
  }
});

app.get("/p_dash", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.patient.findOne({
    where: {
      mobile: user,
    },
  });
  values = await db.appointment.findAll({
    where: { pat_id: user },
  });
  res.render(__dirname + "/p/patientdash", { name: details.name, obj: values });
});

app.get("/p_app", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.patient.findOne({
    where: {
      mobile: user,
    },
  });
  res.render(__dirname + "/p/appointment", { name: details.name });
});

app.get("/p_bill", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.patient.findOne({
    where: {
      mobile: user,
    },
  });
  values = await db.appointment.findAll({
    where: {
      pat_id: details.mobile,
    },
  });
  res.render(__dirname + "/p/pat_bills", {
    name: details.name,
    obj: values,
    patient: details,
  });
});

app.get("/p_query", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.patient.findOne({
    where: {
      mobile: user,
    },
  });
  res.render(__dirname + "/p/queries", {
    name: details.name,
  });
});

//Book appointment
app.post("/book", async (req, res) => {
  const user = req.cookies.user;
  const ps_details = {
    pat_id: req.cookies.user,
    app_date: req.body.date,
    app_time: req.body.time,
    specialist: req.body.specialist,
  };
  const appointment = await db.appointment.create(ps_details);
  const details = await db.patient.findOne({
    where: {
      mobile: req.cookies.user,
    },
  });
  const values = await db.appointment.findAll({
    where: {
      pat_id: req.cookies.user,
    },
  });
  res.render(__dirname + "/p/patientdash", { name: details.name, obj: values });
});

//Updating appointment
app.post("/updateapp", async (req, res) => {
  const ps_details = {
    doc_id: req.body.doc_spl,
  };
  console.log(req.body.doc_spl);
  console.log(req.body.pat);
  const appointment = await db.appointment.update(ps_details, {
    where: {
      pat_id: req.body.pat,
      app_time: req.body.timing,
    },
  });
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: { mobile: user },
  });
  const values = await db.appointment.findAll();
  const doctor = await db.doctor.findAll();
  res.render(__dirname + "/p/appointmentlist", {
    name: details.name,
    obj: values,
    obj1: doctor,
  });
});

//Doctor login
app.get("/doc_login", (req, res) => {
  res.sendFile(__dirname + "/p/doclogin.html");
});

app.post("/doc_login", async (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  const details = await db.doctor.findOne({
    where: {
      // password,
      mobile: user,
      // console.log(details);
    },
  });
  console.log(details);
  if (details == null) {
    res.sendFile(__dirname + "/p/doclogin.html");
  } else {
    if (details.password == password) {
      const values = await db.appointment.findAll({
        where: {
          doc_id: details.name,
        },
      });
      res.cookie("user", details.mobile);
      var arr = [];
      for (var i = 0; i < Object.keys(values).length; i++) {
        const info = await db.patient.findOne({
          where: {
            mobile: values[i].pat_id,
          },
        });
        arr.push(info);
      }
      res.render(__dirname + "/p/docdash", {
        name: details.name,
        obj: values,
        inf: arr,
      });
    } else {
      // console.log(password, details.password);
      res.sendFile(__dirname + "/p/doclogin.html");
    }
  }
});

app.get("/docdash", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.doctor.findOne({
    where: {
      mobile: user,
    },
  });
  const values = await db.appointment.findAll({
    where: { doc_id: details.name },
  });
  var arr = [];
  for (var i = 0; i < Object.keys(values).length; i++) {
    const info = await db.patient.findOne({
      where: {
        mobile: values[i].pat_id,
      },
    });
    arr.push(info);
  }
  res.render(__dirname + "/p/docdash", {
    name: details.name,
    obj: values,
    inf: arr,
  });
});

app.get("/docpat", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.doctor.findOne({
    where: {
      mobile: user,
    },
  });
  const values = await db.appointment.findAll({
    where: { doc_id: details.name },
  });
  var arr = [];
  for (var i = 0; i < Object.keys(values).length; i++) {
    const info = await db.patient.findOne({
      where: {
        mobile: values[i].pat_id,
      },
    });
    arr.push(info);
  }
  res.render(__dirname + "/p/docpat", {
    name: details.name,
    obj: values,
    inf: arr,
  });
});

app.post("/docmed", async (req, res) => {
  const user = req.cookies.user;
  const patient = req.body.patient;
  const details = await db.doctor.findOne({
    where: {
      mobile: user,
    },
  });
  const values = await db.inven.findAll();
  const values2 = await db.bills.findAll({
    where: {
      pat_id: req.body.patient,
    },
  });
  res.render(__dirname + "/p/docmed", {
    name: details.name,
    obj: values,
    patient: patient,
    med: values2,
  });
});

app.post("/cart", async (req, res) => {
  const qty = await db.inven.findOne({
    where: {
      med_id: req.body.med_id,
    },
  });
  const user = req.cookies.user;
  if (qty.med_qty - req.body.med_qty > 0) {
    const update = await db.inven.update(
      { med_qty: qty.med_qty - req.body.med_qty },
      {
        where: {
          med_id: req.body.med_id,
        },
      }
    );

    const ps_details = {
      pat_id: req.body.patient,
      med_id: req.body.med_id,
      med_name: req.body.med_name,
      medi_qty: req.body.med_qty,
      timing: req.body.tim,
    };
    const bills = await db.bills.create(ps_details);
  }
  const details = await db.doctor.findOne({
    where: {
      mobile: user,
    },
  });

  const values = await db.inven.findAll();
  const values2 = await db.bills.findAll({
    where: {
      pat_id: req.body.patient,
    },
  });
  console.log(req.body.patient);

  res.render(__dirname + "/p/docmed", {
    name: details.name,
    obj: values,
    med: values2,
    patient: req.body.patient,
  });
});

app.post("/bill_bill", async (req, res) => {
  const user = req.cookies.user;
  const id = req.body.pat_id;
  console.log(id);

  const dell = await db.bills.destroy({
    where: {
      id: id,
    },
  });

  const details = await db.doctor.findOne({
    where: {
      mobile: user,
    },
  });

  const values = await db.inven.findAll();
  const values2 = await db.bills.findAll({
    where: {
      pat_id: req.body.patient,
    },
  });

  res.render(__dirname + "/p/docmed", {
    name: details.name,
    obj: values,
    med: values2,
    patient: req.body.patient,
  });
});

app.post("/pres", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.pharstaff.findOne({
    where: {
      mobile: user,
    },
  });
  const values = await db.bills.findAll({
    where: {
      pat_id: req.body.patient,
    },
  });
  //  for( int i=0;i<Object.keys(values).length;i++)
  const id = values[0].pat_id;
  const patient = await db.patient.findOne({
    where: {
      mobile: id,
    },
  });
  var arr = [];
  for (var i = 0; i < Object.keys(values).length; i++) {
    const info = await db.inven.findOne({
      where: {
        med_id: values[i].med_id,
      },
    });
    arr.push(info);
  }
  res.render(__dirname + "/p/bill", {
    name: details.name,
    obj: values,
    patient: patient,
    price: arr,
    page: "/phor",
  });
});

app.post("/p_pres", async (req, res) => {
  const user = req.cookies.user;
  const details = await db.patient.findOne({
    where: {
      mobile: user,
    },
  });
  const values = await db.bills.findAll({
    where: {
      pat_id: req.body.patient,
    },
  });
  //  for( int i=0;i<Object.keys(values).length;i++)
  const id = values[0].pat_id;
  // const patient = await db.patient.findOne({
  //   where: {
  //     mobile: id,
  //   },
  // });
  var arr = [];
  for (var i = 0; i < Object.keys(values).length; i++) {
    const info = await db.inven.findOne({
      where: {
        med_id: values[i].med_id,
      },
    });
    arr.push(info);
  }
  res.render(__dirname + "/p/bill", {
    name: details.name,
    obj: values,
    patient: details,
    price: arr,
    page: "/p_bill",
  });
});

// //Contact us homepage link
// app.get("/contact", (req, res) => {
//   res.sendFile(__dirname + "/p/contact.html");
// });
