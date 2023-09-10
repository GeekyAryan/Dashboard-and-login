
var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
/* GET home page. */
router.post("/patient_submit", upload.any(), function (req, res, next) {
  pool.query("insert into patients(patientName, emailid, mobileno, patientlogo, address,createdat, updatedat,password,hospitalid,doctorid)values(?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.patientName,
      req.body.emailid,
      req.body.mobileno,
      req.files[0].filename,
      req.body.address,
      req.body.createdat,
      req.body.updatedat,
      req.body.password,
      req.body.hospitalid,
      req.body.doctorid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Student Data Added Successfully" });
      }
    }
  );
});

router.get("/fetch_all_patient", function (req, res) {
  pool.query(
    "select R.*,(select H.hospitalname from hospitals H where H.hospitalid=R.hospitalid) as hospitalname, (select D.doctorname from doctor D where D.doctorid=R.doctorid) as doctorname  from patients R",
    function (error, result) {
      if (error) {
        console.log(error);
        res
          .status(200)
          .json({ status: false, message: "Database Error", data: [] });
      } else {
        console.log(result);
        res
          .status(200)
          .json({
            status: true,
            data: result,
            message: "Patient Added Successfully",
          });
      }
    }
  );
});

router.post("/patient_edit_data", upload.any(), function (req, res, next) {
  pool.query(
    "update  patients set patientname=?, emailid=?, mobileno=?,  address=?, stateid=?, cityid=?, batchid=?, timeid=?, updatedat=? where patientid=?",
    [
        req.body.patientname,
        req.body.emailid,
        req.body.mobileno,
        req.files[0].filename,
        req.body.address,
        req.body.hospitalid,
        req.body.doctorid,
        req.body.createdat,
        req.body.updatedat,
        req.body.password,
      req.body.patientid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Student Data Updated Successfully" });
      }
    }
  );
});

router.post("/patient_edit_logo", upload.any(), function (req, res, next) {
  pool.query(
    "update patients set patientlogo=? where patientidid=?",
    [req.files[0].filename, req.body.studentid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({
            status: true,
            message: "Logo Certificate Updated Successfully",
          });
      }
    }
  );
});

router.post("/patient_delete", upload.any(), function (req, res, next) {
  pool.query(
    "delete from patients  where studentid=?",
    [req.body.studentid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(200).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Patient Deleted Successfully" });
      }
    }
  );
});

router.post('/chk_admin_login',function(req,res,next){
  pool.query("select * from patients where (emailid=? or mobileno=?) and password=? ",[req.body.emailid,req.body.mobileno,req.body.password],function(error,result){
  
    if(error)
    {
      console.log(error);
       res.status(200).json({status:false,message:'Server Error'})
    }
  
    else{
  
      if(result.length==0)
      { 
        res.status(200).json({status:false,message:'Invalid email address/mobile number/password'})
      }
  
       else
       {res.status(200).json({status:true,message:'Valid Login',data:result[0]})}
    }
  })
  
  
  
  })

module.exports = router;
