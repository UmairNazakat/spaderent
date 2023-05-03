const user = require("../models/user");
const sendMail = require('../sendmail/sendmail.js');

exports.createUser = function (req, res) {
  const { firstName, lastName, email, phone, password, planID } = req.body;
  user.sendmail(email, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
    } else if (result.length > 0) {
      res.status(200).json({
        // message : "successful send"
        message: "Email Already exist",
      });

    } else {
      user.createUser(firstName, lastName, email, phone, password, planID, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error adding user to database");
        }
        console.log(result);
        res.send("User added to database");
      }
      );
    }
  });
}
exports.checkemail = function (req, res) {
  const {email} = req.body;
  user.sendmail(email, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
    } else if (result.length > 0) {
      res.status(200).json({
        // message : "successful send"
        message: "Email Already exist",
      });

    } else {
      res.status(200).json({
        // message : "successful send"
        message: "New user",
      });
    }
  });
}



 
exports.Signin = function (req, res) {
  const { email, password } = req.body;
  user.Signin(email, password, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
    }else if ((result.length > 0)) {
      console.log(result.length);
      console.log(result);
      res.status(200).json({
        body: result,
        message:"Successful Login"
      });
    } else {
      res.status(404).json({
        message:"Not Found"
      });;
    }
  });
};
exports.Signinall = function (req, res) {
  user.Signinall((err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
    }
    if (result.length > 0) {
      console.log(result.length);
      res.status(200).json({
        body: result,
      });
    } else {
      console.log("not found");
      res.status(200).json({
        message: "Not Found",
      });
    }
  });
};








//  ############################# Reset Email ############################################################
exports.createResetEmail = async (req, res) => {

  const email = req.body.email;
  const mailSubject = "Spade Reset Email";
  const random = Math.floor(100000 + Math.random() * 900000)
  user.sendmail(email, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
    }
    if (result.length > 0) {
      const userid = result[0].id;
      const name = result[0].FirstName + " " + result[0].LastName
      sendMail(email, mailSubject, random, name);
      user.insertPasswordCode(random, userid, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error");
        } else {
          res.status(200).json({
            // message : "successful send"
            message: "Successful code send on email",
            id: userid
          });

        }
      });
      // user.insertPasswordCode(random, userid ); 

    } else {
      // console.log("not found");
      res.status(200).json({
        message: "Not Found",
      });
    }
  });

};

//  ############################# Reset Email ############################################################


//  ############################# Verify Reset Email Code ############################################################
exports.verifyResetEmailCode = (req, res) => {
  const id = req.body.id;
  const token = req.body.token;
  user.verifyResetEmailCode(id, token, (err, result) => {


    if (err) {
      console.error(err);
      res.status(500).send('Error');
    } else if (result.length > 0) {
      const now = new Date(result[0].updated_at);
      const now2 = new Date();
      const formattedDate = now2.toISOString().slice(0, 19).replace('T', ' ');
      const time = new Date(formattedDate) - now;
      const time2 = time / 1000;
      if (time2 >= 120) {
        res.status(408).send("Time out");
      } else {

        res.status(200).json({
          message: "Successful",
          id: id,
          token: token
        });
      }
    } else {
      res.status(404).json({
        message: "not found"
      });
    }
  });
}
//  ############################# Verify Reset Email Code ############################################################


//  ############################# Update Password ############################################################

exports.updatePassword = (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const token = req.body.token;
  const confirmpassword = req.body.confirmpassword;

  if (password == confirmpassword) {
    user.updatePassword(id, password, token, (err, result) => {
      if (err) {
        res.status(500).send('Error');
      } else {
        res.status(200).json({
          message: "Successful password saved"
        });
      }

    })
  } else {
    res.status(201).send("Password Does not match ")
  }
}
//  ############################# Update Password ############################################################


//  ############################# resend Code ############################################################
exports.resendCode = (req, res) => {
  const id = req.body.id;

  user.resendCodeselect(id, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error");
    } else {
      const email = result[0].Email;
      const mailSubject = "Spade Reset Email";
      const random = Math.floor(100000 + Math.random() * 900000);
      user.sendmail(email, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error");
        }
        if (result.length > 0) {
          const userid = result[0].id;
          const name = result[0].FirstName + " " + result[0].LastName
          sendMail(email, mailSubject, random, name);
          user.insertPasswordCode(random, userid, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error");
            } else {
              res.status(200).json({
                // message : "successful send"
                message: "Successful code send on email",
                id: userid
              });

            }
          });
          // user.insertPasswordCode(random, userid ); 

        } else {
          // console.log("not found");
          res.status(404).json({
            message: "not found"
          });
        }
      });

    }
  });
}
  //  ############################# resend Code ############################################################
