// $(document).DOM(function () {
  const timeSheets = JSON.parse(localStorage.getItem("timeSheet"));
  var displayData = document.querySelector(".table-body");
  var displayTotalHours = document.getElementById("workingHours");
  const viewForm = document.querySelector(".data-view");
  const tableView = document.querySelector(".data_table");
  const searchInput = document.querySelector("#search");
  let totalWorkHours = 0;

  let userEmail = sessionStorage.getItem("user");

  getDataView();

  searchInput.addEventListener("input", function (event) {
    const searchDate = event.target.value; // Get the selected date from the Date input
    const fromattedSearchDate = formatDate(searchDate); // Function to format date to 'dd-mm-yyyy' format
    displayData.innerHTML = ""; // Clear previous results
    totalWorkHours = 0;

    const filteredTimeSheets = timeSheets.filter((sheet) => {
      console.log(sheet.date === sheet.date);
      return sheet.email === userEmail && sheet.date === fromattedSearchDate;
    });
    if (filteredTimeSheets.length > 0) {
      filteredTimeSheets.forEach((sheet, index) => {
        totalWorkHours += sheet.totalWork;

        displayData.innerHTML += `
        <tr>
            <td>${sheet.date}</td>
            <td>${sheet.checkIn}</td>
            <td>${sheet.checkOut}</td>
            <td>${msToHms(sheet.totalWork)}</td>
            <td><i class="fa-solid fa-calendar-minus" onclick="deleteUser()" data-index="${index}"></i></td>
        </tr>`;
      });
      displayTotalHours.innerText = `${msToHms(totalWorkHours)}`;
    } else {
      // If no records found, display "No Record" in the <td>
      displayData.innerHTML = `
      <tr>
          <td colspan="4">No Record</td>
      </tr>`;
      displayTotalHours.innerText = ""; // Clear total hours display
    }
  });

  // Function to format date to 'dd-mm-yyyy' format
  function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  }

  function getDataView() {
    totalWorkHours = 0;

    if (timeSheets && timeSheets.length > 0) {
      const timeSheetsSortedByDate = timeSheets.slice().sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.checkIn}`);
        const dateB = new Date(`${b.date} ${b.checkIn}`);
        return dateA.getTime() - dateB.getTime();
      });

      timeSheetsSortedByDate.forEach((sheet, index) => {
        if (sheet.email === userEmail) {
          // const hours = Math.floor(sheet.totalWork / (1000 * 60 * 60));
          // const minutes = Math.floor((sheet.totalWork % (1000 * 60 * 60)) / (1000 * 60));
          totalWorkHours += sheet.totalWork;

          displayData.innerHTML += `
          <tr>
            <td>${sheet.date}</td>
            <td>${sheet.checkIn}</td>
            <td>${sheet.checkOut}</td>
            <td>${msToHms(sheet.totalWork)}</td>
            <td><i class="fa-solid fa-calendar-minus" onclick="deleteUser(${index})"></i></td>
          </tr>`;
        }
        // <td>${hours}:${minutes < 10 ? '0' : ''}${minutes}</td>
      });

      displayTotalHours.innerText += `${msToHms(totalWorkHours)}`;

    } else {
      viewForm.innerHTML = `<h2>No Data Available...</h2><br/>`;
      viewForm.classList.remove("data_table");
    }
  }

  function msToHms(milliseconds) {
    const totalSeconds = milliseconds / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${String(hours).padStart(
      2,
      "0"
    )}:${paddedMinutes}:${paddedSeconds}`;
  }

  
// });
function deleteUser(index) {
  // Display confirmation block
  if (confirm("Are you sure you want to delete this user's data?")) {
    // If user confirms, perform the deletion
    timeSheets.splice(index, 1);
    localStorage.setItem('timeSheet', JSON.stringify(timeSheets));
    displayData.innerHTML = '';
    getDataView();
  }
}