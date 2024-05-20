import React from "react"
import { useGlobalContext } from '../../Services/context';
import "./AuthenticationForms.style.component.css"
import axios from "axios"
import SignUp from "./SignUp"
import LogIn from "./LogIn"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AuthenticationForms(props) {
    const { setLoggedInUser } = useGlobalContext();

    const [loginDetails, setLoginDetails] = React.useState({
        email: "",
        password: ""
    })

    const [signUpDetails, setSignUpDetails] = React.useState({
        name: "",
        phone: "",
        email: "",
        city: "",
        password: "",
        isUser: true
    })

    const [isSignUp, setIsSignIn] = React.useState(true)

    let toastID;

    async function postDetailsToAPI() {
        if (isSignUp) {
            try {
                const response = await axios.post("https://recyclify-backend.onrender.com/api/auth/signup", JSON.stringify(signUpDetails), {
                // const response = await axios.post("http://localhost:3001/api/auth/signup", JSON.stringify(signUpDetails), {
                    headers: {
                        "Content-Type": "application/JSON",
                    }
                })
                // console.log(response.data);
                toast.update(toastID, { render: "Successfully created account !", type: "success", isLoading: false })
                setLoggedInUser(response)
                console.log(response)
            } catch (error) {
                console.log(error)
                toast.update(toastID, { render: error.response.data.msg, type: "fail", isLoading: false })
            }
        } else {
            try {
                // console.log(JSON.stringify(loginDetails));
                const response = await axios.post("https://recyclify-backend.onrender.com/api/auth/login", JSON.stringify(loginDetails), {
                // const response = await axios.post("http://192.168.1.143:3001/api/auth/login", JSON.stringify(loginDetails), {
                    headers: {
                        "Content-Type": "application/JSON",
                    }
                })
                console.log('status log', response.status);
                console.log('herrr');
                setTimeout(() => { setLoggedInUser(response) }, 800)
                toast.update(toastID, { render: "Successfully authenticated !", type: "success", isLoading: false })
            } catch (error) {
                toast.update(toastID, { render: error.response.data.msg, type: "fail", isLoading: false })
                // console.log(error)
            }
        }
    }

    function handleSubmit(event) {
        if (signUpDetails.phone.length !== 10 && isSignUp) {
            alert("Phone no. should be 10 digit !")
        }
        else {
            toastID = toast.loading("Authenticating...")
            postDetailsToAPI()
        }
        event.preventDefault();
    }

    function handleInputFields(event) {
        isSignUp ?
            setSignUpDetails(prevState => {
                let isUser = signUpDetails.isUser;
                if (event.target.name === "isUser") {
                    isUser = !signUpDetails.isUser;
                }
                return {
                    ...prevState,
                    [event.target.name]: event.target.value,
                    "isUser": isUser
                }
            })
            :
            setLoginDetails(prevState => {
                return {
                    ...prevState,
                    [event.target.name]: event.target.value
                }
            })
    }

    function toggleSignUpLoginModal(event) {
        setIsSignIn(!isSignUp)
    }

    const signUpOrLogInForm =
        isSignUp ?
            <SignUp userDetails={signUpDetails} handleSubmit={handleSubmit} handleInputFields={handleInputFields} />
            :
            <LogIn userDetails={loginDetails} handleSubmit={handleSubmit} handleInputFields={handleInputFields} />

    const headerText = isSignUp ?
        <p>Already have an account ? <span onClick={toggleSignUpLoginModal}>Log In</span></p>
        :
        <p>Don't have an account ? <span onClick={toggleSignUpLoginModal}>Create account</span></p>

    return (
        <React.Fragment>
            <button className="modalCloseButton" onClick={props.onButtonClick}></button>
            <div className="authenticationContainer">
                <div className="modalBackground"></div>
                <div className={isSignUp ? "modal modalForSignUpForm" : "modal"}>
                    <div className="heading">
                        <h2>Hey! Welcome to the better place 🙌</h2>
                        {headerText}
                    </div>
                    {signUpOrLogInForm}
                </div>
                <ToastContainer />
            </div>
        </React.Fragment >
    );
}

export default AuthenticationForms;