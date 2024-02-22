$(document).ready(function () {
const timeSheets = JSON.parse(localStorage.getItem('timeSheet')) ;
var displayData = document.querySelector(".table-body");
var displayTotalHours = document.getElementById("workingHours");
const form = document.querySelector(".data-view");
let totalWorkHours = 0;

let userEmail = sessionStorage.getItem("user");

getDataView();

function getDataView() {
  // debugger

  totalWorkHours = 0;

  const timeSheetsSortedByDate = timeSheets.slice().sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.checkIn}`);
    const dateB = new Date(`${b.date} ${b.checkIn}`);
    return dateA.getTime() - dateB.getTime();
  });

  if (timeSheets && timeSheets.length > 0) {
    timeSheetsSortedByDate.forEach((sheet) => {
      if (sheet.email === userEmail) {
      const hours = Math.floor(sheet.totalWork / (1000 * 60 * 60));
      const minutes = Math.floor((sheet.totalWork % (1000 * 60 * 60)) / (1000 * 60));
      totalWorkHours += sheet.totalWork;

      displayData.innerHTML += `
        <tr>
            <td>${sheet.date}</td>
            <td>${sheet.checkIn}</td>
            <td>${sheet.checkOut}</td>
            <td>${msToHms(sheet.totalWork)}</td>
            </tr>`;        
          }
          // <td>${hours}:${minutes < 10 ? '0' : ''}${minutes}</td>
    });
    displayTotalHours.innerText += `${msToHms(totalWorkHours)}`;
    
  } else {
    form.innerHTML = `<h2>No Data Available...</h2><br/>`;
    form.classList.remove("data_table");
    form.classList.add("no-data");
  }
}

function msToHms(milliseconds) {
  const totalSeconds = milliseconds / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${String(hours).padStart(2, '0')}:${paddedMinutes}:${paddedSeconds}`;
}

function convertTotalHours(totalWorkHours) {
  const hours = Math.floor(totalWorkHours / (1000 * 60 * 60));
  const minutes = Math.floor((totalWorkHours % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function deleteUser() {
  // debugger
  const removeUser = document.querySelectorAll(".fa-user-minus");
  removeUser.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.getAttribute("data-index");
      // Display confirmation block
      if (confirm("Are you sure you want to delete this user's data?")) {
        // If user confirms, perform the deletion
        userData.splice(index, 1);
        localStorage.setItem("user", JSON.stringify(userData));
        displayData.innerHTML = "";
        getDataView();
      }
    });
  });
}

function editUser(email) {
  window.location.href = `../html/update.html?email=${email}`;
}

})