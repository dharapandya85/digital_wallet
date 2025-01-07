import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios'; //request

export default function Signup() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[errorMessage,setErrorMessage]=useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit=(e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        const user={name,email,password};
        axios
        .post("http://localhost:3000/api/signup",user)
        //promise concept
        //reject message
        //error message
        .then((res)=>{
            alert("Signup successful");
            setName("");
            setEmail("");
            setPassword("" );
            setErrorMessage("");

        })
        .catch((err)=>{
            console.error("Signup error:",err);
                if(err.response){
                    console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
                    setErrorMessage(err.response?.data?.message||"Error signing up");
                }
                else if (err.request) {
                    // No response was received
                    setErrorMessage("No response from the server. Please check your network connection.");
                } else {
                    // Error setting up the request
                    setErrorMessage("Error setting up the request: " + err.message);
                }    
           
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="row">
    <div className="">
    <div className="card p-4 shadow-sn">
    <h2 className="card-title mb-4 text-center">
    CREATE AN ACCOUNT
    </h2>
    <form onSubmit={handleSubmit}>
    <div className="mb-3">
    <label htmlFor="name" className="form-label">
    Name
    </label>
    <input
    type="text"
    id="name"
    className="form-control"
    placeholder="Enter your name"
    value={name}
    onChange={(e)=>setName(e.target.value)}
    required

    />
    </div>
    <div className="mb-3">
    <label htmlFor="email" className="form-label">
    E-Mail
    </label>
    <input
    type="email"
    id="email"
    className="form-control"
    placeholder="Enter your email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    required

    />
    </div>
    <div className="mb-3">
    <label htmlFor="password" className="form-label">
    Password
    </label>
    <input
    type="password"
    id="password"
    className="form-control"
    placeholder="Enter your password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    required

    />
    </div>
    {errorMessage && <p className="text-danger">{errorMessage}</p>}
    <button type="submit" className="btn btn-primary w-100">
    Submit
    </button>
    </form>
    <p className="text-center mt-3">
    Have an account?{" "}
    <Link to="/login" className="link-property">
    Login
    </Link>
    </p>
    </div>
    </div>

    </div>

    </div>
  )
}

//export default Signup;
