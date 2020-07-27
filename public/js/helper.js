/* Helper file for the game

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// DOM elements for the table
let table;
let tbody; 

// Create the type of element you pass in the parameters
const createNode = (element) => {
    return document.createElement(element); 
}

// Append the second parameter(element) to the first one
const appendElement = (parent, el) => {
    return parent.appendChild(el); 
}

const getSocketUrl = async () => {
    fetch('/getSocketUrl')
    .then(data => data);
}

// Function to get data from database
const updateTable = (data) => {
    table = document.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];
    let rows = data;
    let ctr = 1;
    let newTbody = createNode('tbody');
    rows.map((row) => {
        let tr = createNode('tr'),
            tdNumber = createNode('td'),
            tdName = createNode('td'),
            tdScore = createNode('td');
        tr.classList.add("table-content");
        tdNumber.innerHTML = `${ctr++}`;
        tdName.innerHTML = `${row.name}`;
        tdScore.innerHTML = `${row.score}`;
        appendElement(tr, tdNumber);
        appendElement(tr, tdName);
        appendElement(tr, tdScore);
        appendElement(newTbody, tr);
    });
    table.replaceChild(newTbody, tbody);
    tbody = newTbody;
}

// Helper function to check if point lies on the ellipse or not
const checkPoint = (h, k, x, y, r) => { 
    return (pow((x - h), 2) + pow((y - k), 2) ) / pow(r, 2);
} 
