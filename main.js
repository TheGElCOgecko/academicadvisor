// Initialize the selected major the user selected
let selectedMajor = null;

// Major selection change
document.getElementById('major-select').addEventListener('change', function(e) {
    const majorKey = e.target.value;
    selectedMajor = majorKey;
    const major = majorsData[majorKey];
    const detailsDiv = document.getElementById('major-details');
    detailsDiv.innerHTML = `
        <h4>${major.title}</h4>
        <p>${major.description}</p>
        <h5>Required Abilities:</h5>
        <ul>
            ${major.abilities.map(ability => `<li>${ability}</li>`).join('')}
        </ul>
        <h5>Marketability:</h5>
        <p>${major.marketability}</p>
    `;
    document.getElementById('schedule-details').innerHTML = ``
    updateMajorTopics(majorKey);
    populateCoursesList(majorKey);
});

// Update major topics
function updateMajorTopics(majorKey) {
    const topics = majorsData[majorKey].majorTopics;
    const majorTopicsDiv = document.getElementById('major-topics-details');
    majorTopicsDiv.innerHTML = `
        <h5>Topics for ${majorsData[majorKey].title}:</h5>
        <ol>
            ${topics.map(course => `<li>${course}</li>`).join('')}
        </ol>
    `;
}

// Populate courses list
function populateCoursesList(majorKey) {
    const coursesContainer = document.getElementById('courses-container');
    const courses = majorsData[majorKey].courses;
    let coursesHTML = '';
    courses.forEach((course, index) => {
        coursesHTML += `
            <div>
                <input class="form-check-input" type="checkbox" value="" id="course-${index}">
                <label class="form-check-label" for="course-${index}">
                    ${course}
                </label>
            </div>
        `;
    });
    coursesContainer.innerHTML = coursesHTML;
}

// Semester schedule form
document.getElementById('schedule-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!selectedMajor) {
        alert('Please select a major first in the "Select your major" section.');
        return;
    }

    // Get the number of courses to take next semester
    const coursesNextSemester = document.getElementById('courses-next-semester');
    let numOfCourses = parseInt(coursesNextSemester.value);
    if (isNaN(numOfCourses)) {
        alert('Please enter a valid number of courses per semester.');
        return;
    }

    // Get completed courses
    const coursesContainer = document.getElementById('courses-container');
    const checkboxes = coursesContainer.querySelectorAll('input[type="checkbox"]');
    const completedCourses = [];
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            completedCourses.push(majorsData[selectedMajor].courses[index]);
        }
    });
    
    const allCourses = majorsData[selectedMajor].courses;

    // Determine remaining courses not yet taken
    const remainingCourses = allCourses.filter(course => !completedCourses.includes(course));
    if (remainingCourses.length === 0) {
        document.getElementById('schedule-details').innerHTML = `<div class="alert alert-success">
            Congratulations! You have completed all of the required core credits for the ${majorsData[selectedMajor].title} major.
        </div>`;
        return;
    }
    // Adjust if courses left less than desired number of courses
    if (remainingCourses.length < numOfCourses)
        numOfCourses = remainingCourses.length;

    // Get the next set of courses based on the user's preference
    const nextSemesterCourses = remainingCourses.slice(0, numOfCourses);
    // Generate schedule
    let scheduleHTML = `<h5>Your next semester schedule:</h5>
                        <ul>
                            ${nextSemesterCourses.map(course => `<li>${course}</li>`).join('')}
                        </ul>`;
    document.getElementById('schedule-details').innerHTML = scheduleHTML;
});

// Contact form submission (non-functional)
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('contact-success').style.display = 'block';
    this.reset();
});