/*
    We need another page to hold the File Input thingy so it doesn't look so naysty.
    - Sabin 7/24
*/
let projects = [];
$(document).ready(function() {
    projects = JSON.parse(localStorage.getItem('projects'));
    window.addEventListener("contextmenu", function(args) { args.preventDefault(); });

    if (!projects) {
        // Do whatever we plan to do if we don't have data in localstorage yet.
    } else {
        populateProjects();
    }
});


function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader('../test.csv');
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    let projectsIn = [];
    let fragments = event.target.result.split('\n');
    let formattedFragments = [];
    for (const fragment of fragments) {
        formattedFragments.push(CSVtoArray(fragment));
    }
    let titles = formattedFragments[3];
    formattedFragments = formattedFragments.splice(4);

    for (const project of formattedFragments) {
        let object = {};
        let i = 0;
        for (let title of titles) {
            object[title.replace(' ', '_').toLowerCase()] = project[i];
            i++;
        }
        projectsIn.push(object);
    }
    localStorage.setItem('projects', JSON.stringify(projectsIn.slice(0, projectsIn.length - 1)));
    projects = projectsIn;
    populateProjects();
}


function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = []; // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
}

function populateProjects() {
    for (let i = 0; i < projects.length; i++) {
        $(".col-" + (i % 2 + 1)).append(
            '<div class="alert alert-warning" onclick="populateModal(\'' + projects[i].project_name + '\' )" data-toggle="modal" data-target="#myModal" role="alert">' +
            projects[i].project_name +
            '</div>'
        );
    }
}

function populateModal(name) {
    let currentModal = projects[_.findKey(projects, { 'project_name': name })];
    $('#projectName').text(currentModal.project_name);
    $('#studentNames').text(currentModal.students);
    $('#advisorNames').text(currentModal.advisors);
    $('#projectDescription').text(currentModal.project_description);
    $("#advisorPhoto").attr("src", 'images/' + currentModal.advisor_photo);
    $("#studentPhoto").attr("src", 'images/' + currentModal.student_photo);
    $("#projectPhoto").attr("src", 'images/' + currentModal.project_photo);
}

//Do the Tab™
function openTheTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
