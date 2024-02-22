"use strict";

const form = document.querySelector(".employee-form");
const user_name = document.getElementById("name");
const age = document.getElementById("age");
const mobile = document.getElementById("number");
const email = document.getElementById("email");
const password = document.getElementById("password");
const cpassword = document.getElementById("cpassword");
const eyeIcon = document.getElementById("eye-icon");
const eyeIcon2 = document.getElementById("eye-icon2");
const requirementList = document.querySelectorAll(".password-match-list li");
let emailValid = false;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
const emailregex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
const passRequire = [
    { regex: /.{8,16}/, index: 0 }, // Minimum of 8 Character
    { regex: /[0-9]/, index: 1}, // At least one number
    { regex: /[A-Z]/, index: 2}, // At least one uppercase letter
    { regex: /[a-z]/, index: 3}, // At least one lowercase letter
    { regex: /[^A-Za-z0-9]/, index: 4}, // At least one special character
];

user_name.addEventListener("input", function(e){
    let isCharacter = (/^[A-Za-z]+(?: [A-Za-z]+)*$/).test(e.target.value);
    const inputControl = user_name.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
  
    if (!isCharacter) {
      errorDisplay.innerText = 'Bro You are not name after King '
    } else {
        errorDisplay.innerText = "";
        
    }
});

email.addEventListener("input", function(e){
    let isCharacter = emailregex.match(e.target.value);
    const inputControl = email.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
  
    if (!isCharacter) {
      errorDisplay.innerText = 'Please enter valid email address'
    } else {
        errorDisplay.innerText = "";
    }
});

email.addEventListener("blur", event => {
    // debugger
    let userMail = event.target.value;
    let emailRequired = '^[a-zA-Z0-9._%+-]+@(gmail|outlook|yahoo)\.[a-zA-Z]{2,}$';
    let isValidEmail = userMail.match(emailRequired);
    const inputControl = email.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
  
    if (!isValidEmail) {
      errorDisplay.innerText = 'Domain eg. gmail.com'
    } else {
        emailValid = true;
        errorDisplay.innerText = "";
        inputControl.classList.add("success");
        inputControl.classList.remove("error");

    }
});

// password.addEventListener("input", function(e){
//     let passReg = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$', 'i');
//     let isCharacter = passReg.test(e.target.value);
//     const inputControl = password.parentElement;
//     const errorDisplay = inputControl.querySelector(".error");
  
//     if (!isCharacter) {
//       errorDisplay.innerText = 'Please Enter Valid Password'
//     } else {
//         errorDisplay.innerText = "";
        
//     }
// });

password.addEventListener("keyup", (e) => {
    document.querySelector(".password-match-list").style.display = "block";
    if(!isEmpty(password)) {
    
        passRequire.forEach(item => {
            // Check if Enter Letter is Matches
            const isValid = item.regex.test(e.target.value);
            const requirementItem = requirementList[item.index];
            if(isValid) {
                requirementItem.firstElementChild.className = "fa-solid fa-check";
                requirementItem.classList.add('valid')
            } else {
                requirementItem.firstElementChild.className = "fa-solid fa-xmark";
                requirementItem.classList.remove('valid')
            }
        })
    } else {
        document.querySelector(".password-match-list").style.display = "none";
    }
})

password.addEventListener("blur", (e) => {
    document.querySelector(".password-match-list").style.display = "none";
})

eyeIcon.addEventListener("click", ()=> {
    password.type = password.type === "password" ? "text" : "password";

    eyeIcon.className = `fa-solid fa-eye${password.type !== "password" ? '-slash':""}`
})

eyeIcon2.addEventListener("click", ()=> {
    cpassword.type = cpassword.type === "password" ? "text" : "password";

    eyeIcon2.className = `fa-solid fa-eye${cpassword.type !== "password" ? '-slash':""}`
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validate();
});

function validate() {
    let user = JSON.parse(localStorage.getItem("employee"));
    let emailExists = false;
    let mobileExists = false;

    if (!isEmpty(user_name)) { setSuccess(user_name)}
    else { setError(user_name, "Good Name should be there"); }

    if (!isEmpty(age)) { 
        if((parseInt(age.value) >= 18 && parseInt(age.value) <= 30)) {
            setSuccess(age);
        } else {
            setError(age, 'Please Check Your Age')
        }
    } else { 
        setError(age, 'Age cannot be blank'); 
    }

    if(!isEmpty(mobile)) {
        
        let mobileNumber = Number(mobile.value);
        if( typeof mobileNumber == 'number' && mobileNumber.toString().length >= 10) {
            if(user !== null) {
                let isValid = user.some((item)=> { if(item.mobile  === mobile.value) return true; });
                if(isValid) {
                    setError(mobile, "Mobile Number Should Be Unique");
                } else {
                    mobileExists = true;
                    setSuccess(mobile);
                }
            } else {
                mobileExists = true;
                setSuccess(mobile);
            }
        }
    } else { setError(mobile, "Please Check The Number"); }

    if (!isEmpty(email)) {
        let list = isExistEmail(email.value, user);

        if(!(email.value).match(emailregex)){
            setError(email, "Sorry Your Email Does Not Match the Guidlines");
        }
        else if(list()){
            setError(email, "Sorry Your Email Should Be Unique");
        }
        else if((email.value).match(emailregex)){
            emailExists = true;
            setSuccess(email);
        }
        
    } else {
        setError(email, 'Email cannot be blank');
    }

    if(!isEmpty(password)) {
        if (!passwordRegex.test(password.value) && password.value.trim().length < 8) {
            setError(password, 'Password must be strong');
        } else {
            setSuccess(password)
        }
    } else {
        setError(password, 'Hey, Buddy Password cannot be empty');
    }

    if(!isEmpty(cpassword)) {
        if (!passwordRegex.test(cpassword.value)) {
            setError(cpassword, 'Password must contain at least 8 characters, including at least one number, one lowercase letter, and one uppercase letter.');
        } else {
            setSuccess(cpassword)
        }
    } else {
        setError(cpassword, 'Look Your Password Again');
    }

    if(!isEmpty(cpassword) && !isEmpty(cpassword)) {
        if(password.value.trim() !== cpassword.value.trim()) {
            alert('Password and Confirm Password should be Twining');
        }
    } 

    if(!isEmpty(user_name) && !isEmpty(age) && !isEmpty(mobile) && !isEmpty(email) && !isEmpty(password) && !isEmpty(cpassword) && emailExists && mobileExists && emailValid) {
        console.log("User is Creating");
        createUser(user_name.value, age.value, mobile.value, email.value, password.value);
    }
    
}

function isExistEmail(emailValue, user) {
    let isInList=()=>{ 
        if(user){
            for(let index of user) {
                if (index.email === emailValue) {
                    return true;
                }
            };
        }
        return false;
    }

    return isInList;
}

function createUser(user_name, age, mobile, email, password) {
    
    // let userCounter= JSON.parse(localStorage.getItem("employee"))?JSON.parse(localStorage.getItem("employee")).length :0
    
    const user = {
        // user_id: userCounter +1,
        name: user_name,
        age: age,
        mobile: mobile,
        email: email,
        password: password
    };

    saveUserData(user);
}

function saveUserData(user) {
    
    let dataPresent = localStorage.getItem("employee") ? JSON.parse(localStorage.getItem("employee")):
    localStorage.setItem("employee", []) ;
    if(dataPresent) {
        dataPresent.push(user);
        localStorage.setItem("employee", JSON.stringify(dataPresent));
        console.log("User Data Saved Successfully");
        
    } else {
        dataPresent=[]
        dataPresent.push(user);
        localStorage.setItem("employee", JSON.stringify(dataPresent));
        console.log('User Created Successfully');
    }
    form.reset();
    window.location.href = '../html/success.html';
}

function isEmpty(data) {
    return data.value.trim() === '';
}
  
  const setError = (element, message) => {
      const inputControl = element.parentElement;
      const errorDisplay = inputControl.querySelector(".error");
    
      errorDisplay.innerText = message;   
      inputControl.classList.add("error");
      inputControl.classList.remove("success");
};
  
  const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const successDisplay = inputControl.querySelector(".error");
  
    successDisplay.innerText = "";
    inputControl.classList.add("success");
    inputControl.classList.remove("error");
};