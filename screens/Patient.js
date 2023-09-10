import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

import { useState,useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { makeStyles } from "@mui/styles";
 import Heading from "../components/Heading/Heading";
import UploadFile from '@mui/icons-material/UploadFile';
import Swal from 'sweetalert2'
import { serverURL,getData,postData } from "../services/ServerServices";
import { useNavigate } from 'react-router-dom';
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";




const useStyles = makeStyles({
  root: {
    width: "auto",
    height: "100vh",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

export default function Patient() {

  var navigate = useNavigate()
  const admin = JSON.parse(localStorage.getItem('ADMIN'))
  console.log(admin);
  var classes = useStyles();


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


  const [resError,setResError]=useState({})
  
  const handleError = (error, input,message) => {
    setResError(prevState => ({...prevState, [input]:{'error':error,'message':message}}));
    console.log("CC",resError)
   };
   const validation=()=>
   {  var submitRecord=true
      if(patientName.trim().length==0)
      {
       handleError(true,'patientName',"Pls Input Patient Name")
        
       submitRecord=false
      }
    
      if(!mobileNumber || !(/^[0-9]{10}$/).test(mobileNumber))
      {
       handleError(true,'mobileNumber',"Pls Input Correct Mobile Number")
        
       submitRecord=false
      }
      if(!emailid || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid))) 
     {
       handleError(true,'emailid',"Pls Input Correct Email Address")
        
       submitRecord=false
     }
 
     if(!address)
     {
      handleError(true,'address',"Pls Input Address")
       
      submitRecord=false
     }
    
    
     if(!hospitalid)
     {
      handleError(true,'hospitalid',"Pls Select Batch Time")
       
      submitRecord=false
     }

     if (!password) {
      handleError("password", "Pls Input Password");
      submitRecord = false;
    }
   
     return submitRecord
   } 

   const handleClickShowPassword = () => setShowPassword((show) => !show);

const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

   const clearValue = () => {
    setPatientName("")
    setEmailid("");
    setMobileNumber("");
    setAddress("");
    setHospitalId("Choose Hospital...");
    setDoctorId("Choose Doctor...");
    setPatientLogo({ fileName: "/assets/watermark.png", bytes: "" });
    setPassword("");
  };



const fetchAllHospitals=async()=>{

    var result=await getData('batchtime/fetch_all_hospitals')

    setHospitals(result.data)


  }

  useEffect (function()

  {

       fetchAllHospitals()
 },[])

 const fillHospital=()=>{
  return hospitals.map((item)=>{
    return<MenuItem value={item.hospitalid}>{item.hospitalname}</MenuItem>
  })
}



  const fetchAllDoctors=async(hospitalid)=>{
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
    setHospitalId(event.target.value)
    fetchAllDoctors(event.target.value)
  }

 
   const handleLogo=(event)=>{
    setPatientLogo({url:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
   } 

   const handleSubmit=async()=>
   {
 
    var error=validation()
    console.log("After Submit:",resError)
   if(error)
   {   

     var formData=new FormData()
     formData.append('patientid', patientId)
     formData.append('patientName',patientName)
     formData.append('emailid',emailid)
     formData.append('mobileno',mobileNumber)
     formData.append('address',address)
    
  //    formData.append('url',url)
  formData.append("password", password);
  formData.append('hospitalid',hospitalid)
  formData.append('doctorid',doctorid)
     formData.append('patientlogo',patientLogo.bytes)
  
     var d=new Date()
     var cd=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
     formData.append('createdat',cd)
     formData.append('updatedat',cd)
     var result=await postData('patient/patient_submit',formData)
     
     if(result.status)
     {
       Swal.fire({
         icon: 'success',
         title: 'Patient Registration',
         text: result.message,
         
       })
       
     }
     else
     {
       Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: result.message,
 
       })
       clearValue();
     }
   }
  }

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Grid container spacing={2}>
        <Grid item xs={12} className={classes.rowStyle}>
          {/* <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <img src="biglogo.png" width="40" />
            </div>
            <div className={classes.headingStyle}> Patient Registration</div>
          </div> */}

<Heading title={"Patient Register"} />

          <div>
              <FormatListBulletedIcon
               onClick={() => navigate("/displayallpatients")} />
          </div>

       
        </Grid>

          <Grid item xs={6}>
            <TextField       onFocus={()=>handleError(false,'patientName','')}
             error={resError?.patientName?.error}
             helperText={resError?.patientName?.message} onChange={(event)=>setPatientName(event.target.value)}  label="Patient Name" fullWidth></TextField>
          </Grid>

       


          <Grid item xs={6}>
            <TextField       onFocus={()=>handleError(false,'mobileno','')}
             error={resError?.mobilenumber?.error}
             helperText={resError?.mobilenumber?.message} onChange={(event)=>setMobileNumber(event.target.value)}  label="Mobile Number" fullWidth></TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField    onFocus={()=>handleError(false,'emailid','')}
              error={resError?.emailid?.error}
              helperText={resError?.emailid?.message} onChange={(event)=>setEmailid(event.target.value)}  label="Email Address" fullWidth></TextField>
          </Grid>

          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(event) => setPassword(event.target.value)}
              onFocus={() => handleError("password", null)}
              error={!resError.password ? false : true}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Grid>

          <Grid item xs={12}>
            <TextField    onFocus={()=>handleError(false,'address','')}
              error={resError?.address?.error}
              helperText={resError?.address?.message} onChange={(event)=>setAddress(event.target.value)}  label="Address" fullWidth></TextField>
          </Grid>

      

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Hospitals</InputLabel>
              <Select
                  onFocus={()=>handleError(false,'hospitalid','')}
                  error={resError?.hospitalid?.error}
                  helperText={resError?.hospitalid?.message}  label="Batches" value={hospitalid} onChange={handleHospitalChange}>
                <MenuItem>-Select Hospitals-</MenuItem>
                {fillHospital()}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Doctors</InputLabel>
              <Select label="Doctors" value={doctorid} onChange={(event)=>setDoctorId(event.target.value)}>
                <MenuItem>-Select Doctor-</MenuItem>
                {fillDoctors()}
              </Select>
            </FormControl>
          </Grid>

          
          <Grid item xs={6}>
            <Button fullWidth component="label" variant="contained" endIcon={<UploadFile />}>
            <input hidden onChange={handleLogo} 
                accept="image/*"
                multiple
                type="file"/>
              Upload Logo
            </Button>
          </Grid>
         

          <Grid item xs={6} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={patientLogo.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button onClick={handleSubmit}  variant="contained" fullWidth>Submit</Button>
          </Grid>

          <Grid item xs={6}>
            <Button onClick={ clearValue} variant="contained" fullWidth>Reset</Button>
          </Grid>

        </Grid>
      </div>
    </div>
  );
  }


