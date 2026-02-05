import type { signUpInput } from "@kar104/postnote-common"
import axios from "axios"
import { useState, type ChangeEvent,  } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"


export const Auth = ({type} : {type : "signup" | "signin"})=> {
  const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<signUpInput>({
        name : "",
        username : "",
        password : ""
    })

    async function sendRequest() {
        try{
          const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup"? "signup" : "signin"}`,postInputs);
          const jwt = await response.data;
          localStorage.setItem("token",jwt);
          navigate('/blogs')
        }
        catch(e){
          alert(e);
          console.log(e);
        }
    }


    return (
      
  <div className="h-screen flex justify-center items-center space">
    
    <div className="flex flex-col">
      <div className="mb-6 px-10">
        <div className="text-3xl font-extrabold">
          {type === "signup"? "Create an account" : "Log into your account" }
        </div>
        <div className="text-slate-600">
          {type === "signup" ? "Already have an account?" : "Don't have an account?"}
          <Link to={type === "signup"? "/signin" : "/signup"} className="pl-2 underline">{type === "signup"? "Login" : "Register"}</Link>
        </div>
      </div>

      <div className="space-y-3 x-10">
        {type === "signup" ? <LabelledInputs
          label="Name"
          placeholder="Kartikeya Lalge..."
          onChange={(e) => {
            setPostInputs({ ...postInputs, name: e.target.value })
          }}
        /> : null}

        <LabelledInputs
          label="Email"
          placeholder="kar@gmail.com"
          onChange={(e) => {
            setPostInputs({ ...postInputs, username: e.target.value })
          }}
        />

        <LabelledInputs
          label="Password"
          type="password"
          placeholder="123456"
          onChange={(e) => {
            setPostInputs({ ...postInputs, password: e.target.value })
          }}
        />
      </div>
      
      <button onClick={sendRequest} type="button" className="text-white bg-black box-border border border-transparent hover:bg-gray-700 focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 space w-full focus:outline-none mt-5">{type === "signup"? "Sign up" : "Login"}</button>
      
      
    </div>
  </div>
)
}
interface LabelledInputsType {
    label : string,
    placeholder : string,
    onChange : (e: ChangeEvent<HTMLInputElement>) => void,
    type? : string

}

function LabelledInputs ({label , placeholder, onChange , type} : LabelledInputsType) {
    return <div>
       <label className="block mb-2.5 text-sm font-bold text-heading">
  {label}
</label>

<input
  onChange={onChange}
  type={type || "text"}
  id="first_name"
  className="bg-neutral-secondary-medium border border-default-medium text-heading  font-boldtext-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 block w-full px-3 py-2.5 shadow-xs placeholder:text-body transition-all duration-150"
  placeholder={placeholder}
  required
/>



    </div>
}