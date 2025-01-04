let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const searchEl = document.createElement("input"); // Search input
searchEl.setAttribute("id", "search-el");
searchEl.setAttribute("placeholder", "Search bookmarks...");
ulEl.before(searchEl); // Add search bar before the list
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

// Add URL from current tab
tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!myLeads.includes(tabs[0].url)) {
      myLeads.push(tabs[0].url);
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    } else {
      alert("This bookmark already exists!");
    }
  });
});

// Render bookmarks
function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `
      <li>
        <a target='_blank' href='${leads[i]}'>${leads[i]}</a>
        <div class="ed-del-btn">
            <button class="edit-btn" data-index="${i}">Edit</button>
            <button class="delete-item-btn" data-index="${i}">Delete</button>
        </div>
      </li>
    `;
  }
  ulEl.innerHTML = listItems;

  // Add event listeners for edit and delete buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", editBookmark);
  });
  document.querySelectorAll(".delete-item-btn").forEach((btn) => {
    btn.addEventListener("click", deleteBookmark);
  });
}

// Add URL from input
inputBtn.addEventListener("click", function () {
  const url = inputEl.value.trim();
  if (isValidURL(url)) {
    if (!myLeads.includes(url)) {
      myLeads.push(url);
      inputEl.value = "";
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    } else {
      alert("This bookmark already exists!");
    }
  } else {
    alert("Please enter a valid URL!");
  }
});

// Delete all bookmarks
deleteBtn.addEventListener("dblclick", function () {
  if (confirm("Are you sure you want to delete all bookmarks?")) {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
  }
});

// Search bookmarks
searchEl.addEventListener("input", function () {
  const query = searchEl.value.toLowerCase();
  const filteredLeads = myLeads.filter((lead) =>
    lead.toLowerCase().includes(query)
  );
  render(filteredLeads);
});

// Validate URL
function isValidURL(string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*\\/?$",
    "i"
  );
  return !!pattern.test(string);
}

// Edit bookmark
function editBookmark(event) {
  const index = event.target.getAttribute("data-index");
  const newUrl = prompt("Edit the URL:", myLeads[index]);
  if (newUrl && isValidURL(newUrl)) {
    myLeads[index] = newUrl;
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  } else {
    alert("Please enter a valid URL!");
  }
}

// Delete individual bookmark
function deleteBookmark(event) {
  const index = event.target.getAttribute("data-index");
  myLeads.splice(index, 1);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
}
