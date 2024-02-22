"use strict";

const form = document.querySelector(".employee-login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const eyeIcon = document.getElementById("eye-icon");
const emailregex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
let emailValid = false;

eyeIcon.addEventListener("click", ()=> {
    password.type = password.type === "password" ? "text" : "password";
    eyeIcon.className = `fa-solid fa-eye${password.type !== "password" ? '-slash':""}`
})

email.addEventListener("input", (e) => {
    let emailChar = e.target.value
    let isCharacter = emailregex.match(emailChar);
    const inputControl = email.parentElement;
    const errorDisplay = inputControl.querySelector(".error");
  
    if (!isCharacter) {
      errorDisplay.innerText = 'Please enter valid email address'
    } else {
        errorDisplay.innerText = "";
    }
});

email.addEventListener("blur", (e) => {
    // debugger
    let userMail = e.target.value;
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

password.addEventListener("blur", (e) => {
           
    let userPass = e.target.value.trim();

    if (userPass !== "") {
        if (userPass.length < 8) {
           setError(password, "Password must be of 8 characters");
        } else {
           setSuccess(password);
        }
    } else {
        setError(password, "Password cannot be blank");
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validate();
});

async function validate() {
    try {
        let employeeData = await getLocalStorageItems();
        let emailExists = false;
        let passExists = false;

        if (!isEmpty(email) && !isEmpty(password)) {
            let list = await isExistEmailAndPassword(email.value, password.value, employeeData);

            if (emailValid) {
                if (list) {
                    emailExists = true;
                    passExists = true;
                    setSuccess(email);
                    setSuccess(password);
                } else {
                    // setValidationError(email, password, "Invalid email or password combination.");
                    setError(email, "Invalid email or password combination.");
                }
            } else {
                setError(email, "Enter a valid email address.");
            }
        }

        if (emailExists && passExists) {
            sessionStorage.setItem("user", email.value);
            window.location.href = `../html/user.html`
        }
    } catch (err) {
        console.error(`An error occurred while checking the local storage items: ${err}`);
    }
}

// function validate() {

//     let employee = JSON.parse(localStorage.getItem("employee"));
//     let emailExists = false;
//     let passExists = false;

//     if (!isEmpty(email)) {
//         let list = isExistEmail(email.value, employee);

//         if((email.value).match(emailregex)){
//             if(list()){
//                 emailExists = true;
//                 setSuccess(email);
//             } else {
//                 setValidationError(message)
//                 const inputControl = element.parentElement;
//                 const errorDisplay = document.querySelectorAll(".error");
//                 errorDisplay.innerText = message;
//                 inputControl.classList.add("error");
//                 inputControl.classList.remove("success");
                
//             }
//         }
//         else if((email.value).match(emailregex)) {
//             setError(email, "Sorry Your Email Should Be Unique");
//         }
        
//     } else {
//         setError(email, 'Email cannot be blank');
//     }

//     if(!isEmpty(password)) {
//         let passList = isExistPass(password.value, employee);
//         if (!passExists) {
//             setError(password, 'Password must be strong');
//         } else {
//             setSuccess(password)
//         }
//     } else {
//         setError(password, 'Hey, Buddy Password cannot be empty');
//     }

//     if(emailExists && passExists) {
//         console.log("User is Creating");
//     }    
// }

function isExistPass(PassValue, emp) {
    let isInList=()=>{ 
        if(emp){
            for(let index of emp) {
                console.log(index.password);
                if (index.password === PassValue) {
                    return true;
                }
            };
        }
        return false;
    }

    return isInList;
}

async function getLocalStorageItems() {
    try {
        let storedEmployees = JSON.parse(localStorage.getItem("employee")) || [];
        return storedEmployees;
    } catch (err) {
        throw new Error("Failed to parse local storage employees.");
    }
}

async function isExistEmailAndPassword(email, password, employees) {
    let foundMatch = false;
    employees.forEach((emp) => {
        if (emp.email === email && emp.password === password) {
            foundMatch = true;
        }
    });
    return foundMatch;
}

function isExistEmail(emailValue, emp) {
    let isInList=()=>{ 
        if(emp){
            for(let index of emp) {
                if (index.email === emailValue) {
                    return true;
                }
            };
        }
        return false;
    }

    return isInList;
}

function isEmpty(data) {
    return data.value.trim() === '';
}

function setValidationError(element1, elelement2, errorMessage) {
    // const errorBox = $("<div>").addClass("error-box");
    // const errorText = $("<p>").text(errorMessage);
    // const okButton = $("<button>").text("OK").addClass("ok-button");
  
    // errorBox.append(errorText, okButton);
    // $("body").append(errorBox);
  
    // okButton.on("click", () => {
    //   errorBox.remove();
    // });

    setError(email, errorMessage);
    setError(password, errorMessage);

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