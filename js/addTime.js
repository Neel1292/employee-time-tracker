"use strict";

// Get the value of a specific parameter
const uniqueValue = sessionStorage.getItem('user');

const form = document.querySelector(".time-sheet-form");
var date = document.getElementById('date'); 
var sTime = document.getElementById('checkin-time'); 
var eTime = document.getElementById('checkout-time');
let timeDifference = 0;

// Set the default value to today's date
date.value = new Date().toISOString().split('T')[0];


form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(uniqueValue);
    isValidateTime(date.value, sTime.value, eTime.value);
});

function  isValidateTime(userDate, startTime, endTime) {
    if(startTime < endTime) {
        if (isLatestCheckinValid(userDate, startTime)) {
            var checkInTime = new Date(userDate +" "+ startTime);
            var checkOutTime = new Date(userDate +" "+ endTime);
            timeDifference = checkOutTime - checkInTime;
            createTimeSheet(userDate, startTime, endTime);
        }   
    }
    else {
        alert("Enter a Valid Time !!!");
    }
}

function isLatestCheckinValid(userDate, checkInTime, checkOutTime) {
    const timeSheets = JSON.parse(localStorage.getItem('timeSheet')) || [];
    const userTimeSheets = timeSheets.filter(sheet => sheet.email === uniqueValue && sheet.date === userDate);
    
    if (userTimeSheets.length > 0) {
        const lastCheckOut = userTimeSheets[userTimeSheets.length - 1].checkOut;console.log(lastCheckOut);
        const latestCheckIn = new Date(userDate + " " + checkInTime);
        const lastCheckOutTime = new Date(userDate + " " + lastCheckOut);
        
        if (latestCheckIn < lastCheckOutTime) {
            // setError(sTime, "Latest check-in should be greater than last check-out");
            alert( "Latest check-in should be greater than last check-out");
            return false;
        } else {
            setSuccess(sTime);
            return true;
        }
    }
    return true; // No previous time sheets for the date
}

function createTimeSheet(userDate, startTime, endTime) {
    const dateParts = userDate.split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    if(uniqueValue != null) {
        let timeSheet = {
            email: uniqueValue,
            date: formattedDate,
            checkIn: startTime,
            checkOut: endTime,
            totalWork: timeDifference
        }
        saveTimeSheet(timeSheet);
    } else {
        alert("Please Login First !!!");
        window.location.href = "../html/login.html";
    }
}

function saveTimeSheet(timeSheet) {
    let sheet = JSON.parse(localStorage.getItem('timeSheet')) || [];
    sheet.push(timeSheet);
    localStorage.setItem("timeSheet", JSON.stringify(sheet));
    form.reset()
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