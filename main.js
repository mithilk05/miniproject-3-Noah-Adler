class Job {
    constructor({ Title, Posted, Type, Level, Skill, Detail }) {
        this.title = Title;
        this.posted = Posted;
        this.type = Type;
        this.level = Level;
        this.skill = Skill;
        this.detail = Detail;
    }

    getDetails() {
        return `
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Skill:</strong> ${this.skill}<br>
            <strong>Description:</strong> ${this.detail}
        `;
    }

    getNormalizedPostedTime() {
        const match = this.posted.match(/(\d+)\s(minutes?|hours?|days?)\sago/);
        if (!match) return 0;
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.includes("minute")) return value;
        if (unit.includes("hour")) return value * 60;
        if (unit.includes("day")) return value * 1440;
    }
}

let jobs = [];
let filteredJobs = [];

document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("filterButton").addEventListener("click", filterJobs);
document.getElementById("sortTitleAsc").addEventListener("click", () => sortJobs('title', 'asc'));
document.getElementById("sortTitleDesc").addEventListener("click", () => sortJobs('title', 'desc'));
document.getElementById("sortTimeAsc").addEventListener("click", () => sortJobs('time', 'asc'));
document.getElementById("sortTimeDesc").addEventListener("click", () => sortJobs('time', 'desc'));

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            jobs = data.map(jobData => new Job(jobData));
            populateFilters(jobs);
            displayJobs(jobs);
        } catch (error) {
            alert("Invalid JSON file format. Please upload a valid file.");
        }
    };
    reader.readAsText(file);
}

function populateFilters(jobs) {
    const levels = new Set(jobs.map(job => job.level));
    const types = new Set(jobs.map(job => job.type));
    const skills = new Set(jobs.map(job => job.skill));

    populateDropdown("levelFilter", levels);
    populateDropdown("typeFilter", types);
    populateDropdown("skillFilter", skills);
}

function populateDropdown(id, items) {
    const dropdown = document.getElementById(id);
    dropdown.innerHTML = `<option value="all">All</option>`;
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}

function filterJobs() {
    const level = document.getElementById("levelFilter").value;
    const type = document.getElementById("typeFilter").value;
    const skill = document.getElementById("skillFilter").value;

    filteredJobs = jobs.filter(job => {
        return (level === "all" || job.level === level) &&
               (type === "all" || job.type === type) &&
               (skill === "all" || job.skill === skill);
    });

    displayJobs(filteredJobs);
}

function sortJobs(criteria, order) {
    filteredJobs.sort((a, b) => {
        if (criteria === 'title') {
            return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (criteria === 'time') {
            return order === 'asc'
                ? a.getNormalizedPostedTime() - b.getNormalizedPostedTime()
                : b.getNormalizedPostedTime() - a.getNormalizedPostedTime();
        }
    });
    displayJobs(filteredJobs);
}

function displayJobs(jobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";
    jobs.forEach(job => {
        const li = document.createElement("li");
        li.className = "job-item";
        li.innerHTML = `
            <div class="job-header">
                <strong>${job.title}</strong>
                <button onclick="toggleDetails(this)">Details</button>
            </div>
            <div class="job-details">${job.getDetails()}</div>
        `;
        jobList.appendChild(li);
    });
}

function toggleDetails(button) {
    const details = button.parentElement.nextElementSibling;
    details.classList.toggle("show-details");
}
