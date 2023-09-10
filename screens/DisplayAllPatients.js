import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { makeStyles } from "@mui/styles";
import { serverURL,getData,postData } from "../services/ServerServices";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Grid,
  TextField,
  Button,
  Select,
  FormHelperText,
} from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import UploadFile from "@mui/icons-material/UploadFile";
import Swal from "sweetalert2";

// import Heading from "../../components/Heading/Heading";
import Heading from "../components/Heading/Heading";

// const useStyles = makeStyles({
  // rootdisplay: {
  //   width: "auto",
  //   height: "100vh",
  //   background: "#dfe4ea",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // boxdisplay: {
  //   width: "80%",
  //   height: "auto",
  //   borderRadius: 10,
  //   background: "#fff",
  //   padding: 15,
  // },
//   root: {
//     width: "100vw",
//     height: "100vh",
//     background: "#dfe4ea",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   box: {
//     width: "60%",
//     height: "auto",
//     borderRadius: 10,
//     background: "#fff",
//     padding: 15,
//   },
//   center: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

const useStyles = makeStyles({
  root: {
    width: "auto",
    height: "auto",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  rootdisplay: {
    width: "auto",
    height: "100vh",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  boxdisplay: {
    width: "80%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding: 15,
  },

  box: {
    width: "70%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding: 15,
  },
  center:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }
});
export default function DisplayAllPatients() {
    
  const admin = JSON.parse(localStorage.getItem('ADMIN'))
  console.log(admin);

  var classes = useStyles();
  var navigate=useNavigate()
  const [listPatient, setListPatient] = useState([]);
  const [open, setOpen] = useState(false);
  //////////// Patient Data /////////////////////
  const [patientId, setPatientId] = useState(admin.patientid)

  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [hospitalid, setHospitalId] = useState("");
  const [doctorid, setDoctorId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [emailid, setEmailid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address,setAddress]=useState("")
  const [patientLogo, setPatientLogo] = useState({ url: "", bytes: "" });
  const [password, setPassword] = useState("");
  const [tempFile, setTempFile] = useState({
   
    logo: "",
  });
  const [resError, setResError] = useState({});
  const [btnStatus, setBtnStatus] = useState(false);

  const handleError = (error, input, message) => {
    setResError((prevState) => ({
      ...prevState,
      [input]: { error: error, message: message },
    }));
    console.log("CC", resError);
  };
  const validation = () => {
    var submitRecord = true;
    if (patientName.trim().length == 0) {
      handleError(true, "patientName", "Pls Input Patient Name");

      submitRecord = false;
    }
   
    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      handleError(true, "mobileNumber", "Pls Input Correct Mobile Number");

      submitRecord = false;
    }
    if (
      !emailid ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid)
    ) {
      handleError(true, "emailid", "Pls Input Correct Email Address");

      submitRecord = false;
    }

    if (!address) {
      handleError(true, "address", "Pls Input Address");

      submitRecord = false;
    }

    
    if (!hospitalid) {
        handleError(true, "hospitalid", "Pls Select Hospital");
  
        submitRecord = false;
      }
    return submitRecord;
  };

 

  const fetchAllHospitals = async () => {
    var result = await getData("batchtime/fetch_all_hospitals");

    setHospitalId(result.data);
  };

  useEffect(function () {
    fetchAllHospitals();
  }, []);

  const fillHospital = () => {
    return hospitals.map((item) => {
      return <MenuItem value={item.hospitalid}>{item.hospitalname}</MenuItem>;
    });
  };

  

  const fetchAllDoctors=async(batchid)=>{
    var body={hospitalid:hospitalid}
    var result=await postData('batchtime/fetch_all_doctors',body)
    setDoctors(result.data)

  }

  const fillDoctors=()=>{
    return doctors.map((item)=>{
      return<MenuItem value={item.doctorid}>{item.doctorname}</MenuItem>
    })
  }


  const handleHospitalChange=(event)=>{
    setDoctorId(event.target.value)
    fetchAllDoctors(event.target.value)
  }



  const handleLogo = (event) => {
    setPatientLogo({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
    setBtnStatus((prev) => ({ ...prev, logo: true }));
  };
  const handleSubmit = async () => {
    var error = validation();
    console.log("After Submit:", resError);
    if (error) {
      var d = new Date();
      var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      var body = {
        patientname: patientName,
       
    
        emailid: emailid,
        mobileno: mobileNumber,
        address: address,
       
        hospitalid: hospitalid,
        doctorid: doctorid,
    
        patientid: patientId,
      };

      var result = await postData("patient/patient_edit_data", body);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Patient Registration",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
        setOpen(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
        setOpen(false);
      }
    }
  };

  /////////////////////////////////////////////////////

  const handleCancel = (imgStatus) => {
   
     if (imgStatus == 1) {
      setBtnStatus((prev) => ({ ...prev, logo: false }));
      setPatientLogo({ url: tempFile.logo, bytes: "" });
    }
  };
  const editImage = async (imgStatus) => {
    if (imgStatus == 1) {
      var formData = new FormData();
      formData.append("patientid",patientId);
      formData.append("patientLogo",  patientLogo.bytes);
      var result = await postData("patient/patient_edit_logo", formData);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Patient Registration",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
      }

  


      setBtnStatus((prev) => ({ ...prev, logo: false }));
    }
  };

  const editDeleteButton = (imgStatus) => {
    return (
      <div>
        <Button onClick={() => editImage(imgStatus)}>Edit</Button>
        <Button onClick={() => handleCancel(imgStatus)}>Cancel</Button>
      </div>
    );
  };

  const fetchAllStudent = async () => {
    var result = await getData("patient/fetch_all_patient");
    setListPatient(result.data);
  };

  const handleEdit = (rowData) => {
   
    fetchAllDoctors(rowData.hospitalid);
    setPatientId(rowData.patientid);
    setPatientName(rowData.patientName);
  

    setMobileNumber(rowData.mobileno);
    setEmailid(rowData.emailid);
    setAddress(rowData.address);
  
    setHospitalId(rowData.hospitalid);
    setDoctorId(rowData.doctorid);
   
    setPatientLogo({ url: `${serverURL}/images/${rowData.patientLogo}`, bytes: "" });
 
    setTempFile({
   
      logo: `${serverURL}/images/${rowData.patientLogo}`,
    });

    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    fetchAllHospitals();
  };
  const showData = () => {
    return (
      <div>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heading title={"Patient Register"} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                onFocus={() => handleError(false, "patientName", "")}
                error={resError?.patientName?.error}
                helperText={resError?.patientName?.message}
                onChange={(event) => setPatientName(event.target.value)}
                label="Patient Name"
                fullWidth
                value={patientName}
              />
            </Grid>
            
         

            <Grid item xs={4}>
              <TextField
                onFocus={() => handleError(false, "mobileNumber", "")}
                error={resError?.mobileNumber?.error}
                helperText={resError?.mobileNumber?.message}
                onChange={(event) => setMobileNumber(event.target.value)}
                label="Mobile Number"
                fullWidth
                value={mobileNumber}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                onFocus={() => handleError(false, "emailid", "")}
                error={resError?.emailid?.error}
                helperText={resError?.emailid?.message}
                value={emailid}
                onChange={(event) => setEmailid(event.target.value)}
                label="Email Address"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                onFocus={() => handleError(false, "address", "")}
                error={resError?.address?.error}
                helperText={resError?.address?.message}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                label="Address"
                fullWidth
              />
            </Grid>
      

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Hospitals</InputLabel>
                <Select
                  onFocus={() => handleError(false, "hospitalid", "")}
                  error={resError?.hospitalid?.error}
                  helperText={resError?.hospitalid?.message}
                  label="Hospitals"
                  value={hospitalid}
                  onChange={handleHospitalChange}
                >
                  <MenuItem>-Select Hospital-</MenuItem>
                  {fillHospital()}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {resError?.hospitalid?.message}
                </FormHelperText>
              </FormControl>
              {
                //resError?.stateid?.error?<div>{resError?.stateid?.message}</div>:<></>
              }
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select
                  label="Doctor"
                  value={doctorid}
                  onChange={(event) => setDoctorId(event.target.value)}
                >
                  <MenuItem>-Select Doctor-</MenuItem>
                  {fillDoctors()}
                </Select>
              </FormControl>
            </Grid>

        
    

            <Grid item xs={4}>
              <Button
                fullWidth
                component="label"
                variant="contained"
                endIcon={<UploadFile />}
              >
                <input
                  onChange={handleLogo}
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                />
                Upload Logo
              </Button>
            </Grid>
         
            <Grid item xs={4} className={classes.center}>
              <Avatar
                variant="rounded"
                alt="Remy Sharp"
                src={patientLogo.url}
                sx={{ width: 56, height: 56 }}
              />

              <div>{btnStatus.logo ? editDeleteButton(3) : <></>}</div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  const showDataForEdit = () => {
    return (
      <Dialog maxWidth={"md"} open={open}>
        <DialogContent>{showData()}</DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Edit</Button>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  useEffect(function () {
    fetchAllStudent();
  }, []);

  const handleDelete = async (rowData) => {
    Swal.fire({
      title: "Do you want to delete the record?",
      showDenyButton: true,

      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var body = { patientid: rowData.patientid };
        var result = await postData("patient/patient_delete", body);
        if (result.status) {
          Swal.fire("Deleted!", "", result.message);
          fetchAllStudent();
        } else Swal.fire("Fail!", "", result.message);
      } else if (result.isDenied) {
        Swal.fire("Patient not Delete", "", "info");
      }
    });
  };

  function displayAll() {
    return (
      <MaterialTable
        title="Patient List"
        columns={[
          {
            title: "Patients",
            field: "patientName",
            render: (rowData) => (
              <>
                <div>{rowData.patientName}</div>
              </>
            ),
          },
          {
            title: "Address",
            render: (rowData) => (
              <>
                <div>{rowData.address}</div>
                <div>
                  {rowData.doctorname},{rowData.hospitalname}
                </div>
              </>
            ),
          },
          {
            title: "Contact",
            render: (rowData) => (
              <>
                {/* <div>{rowData.phonenumber}</div> */}
                <div>{rowData.mobileno}</div>
                <div>{rowData.emailid}</div>
              </>
            ),
          },
     
          {
            title: "Logo",
            render: (rowData) => (
              <div>
                <img
                  src={`${serverURL}/images/${rowData.patientlogo}`}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                />
              </div>
            ),
          },
        ]}
        data={listPatient}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Student",
            onClick: (event, rowData) => handleEdit(rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete Student",
            onClick: (event, rowData) => handleDelete(rowData),
          },
          { icon:'add',
          isFreeAction:true,
            tooltip:'Add Company',
            onClick: (event) =>navigate('/dashboard/patient')  },

        ]}
      />
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.box}>{displayAll()}</div>
      {showDataForEdit()}
    </div>
  );
}