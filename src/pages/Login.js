import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function Login(){
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const navigate=useNavigate();

const handleSubmit=(e)=>{
    e.preventDefault();
    const user={email,password};

    axios
    .post("http://localhost:3000/api/login",user)
    .then((res)=>{
        const {upi_id,message,balance}=res.data;

        //store user info in local storage
        console.log(">>>>>.",upi_id);
        localStorage.setItem(
            "user",
            JSON.stringify({email,upi_id,balance})
        );
        alert(message); //javascript dialog box 
        navigate("/transaction");
        window.location.reload();

    })

.catch((err)=>alert('Error logging in'));


};
return(
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row">
            <div className="">
                <div className="card p-4 shadow-sm">
                    <h2 className="card-title mb-4 text-center">LOGIN</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                E-MAIL
                            </label>
                            <input
                            type="email"
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
                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        Don't have an account?{" "}
                        <Link to="/signup" className="link-primary">
                        Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>

    </div>
);
}