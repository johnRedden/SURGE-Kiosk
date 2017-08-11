/*
    We need another page to hold the File Input thingy so it doesn't look so naysty.
    - Sabin 7/24
*/
let projects = [];
let toggle = -1;
$(document).ready(function() {

    projects = JSON.parse(localStorage.getItem('projects'));
    window.addEventListener("contextmenu", function(args) {
        args.preventDefault();
    });

    $('#reloader').click(function() {
        location.reload();
    });

    $("#importToggler").click(function() {
        $("#importModal").modal()
    });
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
    var reader = new FileReader();
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
        if (project != null && project.length > 0) {
            let object = {};
            let i = 0;
            for (let title of titles) {
                object[title.replace(' ', '_').toLowerCase()] = project[i];
                i++;
            }
            projectsIn.push(object);
        }
    }
    localStorage.setItem('projects', JSON.stringify(projectsIn.slice(0, projectsIn.length)));
    projects = JSON.parse(localStorage.getItem('projects'));
    populateProjects();
}


function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Can't read file !");
    }
}

// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {

    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    text = text.replace(/\'/g, '123456');

    if (!re_valid.test(text)) { return null; }
    var a = []; // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'").replace(/123456/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"').replace(/123456/g, "'"));
            else if (m3 !== undefined) a.push(m3.replace(/123456/g, "'"));
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
}

function populateProjects() {
    $('#bottomContainer').empty();
    for (let i = 0; i < projects.length; i++) {
        $("#bottomContainer").append(
            '<div class="project-button unselectedbox ' + i + '" id=\"' + projects[i].project_name + '\" onclick="populateModal(\'' + projects[i].project_name.replace(/'/g, "\\'") + '\',' + i + ')" role="alert"><p>' +
            projects[i].project_name +
            '</p></div >'
        );
    }
}

function populateModal(name, box) {
    console.log(name);
    let currentModal = projects[_.findKey(projects, {
        'project_name': name.toString()
    })];
    let currentBox = $("." + box);

    if (box === toggle) {
        currentBox.removeClass('selectedbox');
        currentBox.addClass('unselectedbox');
        toggle = -1

    } else {
        $("." + toggle).removeClass('selectedbox');
        $("." + toggle).addClass('unselectedbox');
        $('#projectDescription').text(currentModal.project_description);
        $('#studentPhoto').attr('src', 'images/' + currentModal.student_photo);
        $('#advisorPhoto').attr('src', 'images/' + currentModal.advisor_photo);
        $('#poster').attr('src', 'images/SURGE_Posters_Resized/' + currentModal.project_photo);

        currentBox.removeClass('unselectedbox');
        currentBox.addClass('selectedbox');
        toggle = box;
    }


}

function populateImageModal(event) {
    let src = event.target.outerHTML.split('src="')[1].split('" class=')[0];
    $('#modalImage').attr('src', src);
    $("#imageModal").modal();
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
$('#logo').click(function() {
    location.reload();
});