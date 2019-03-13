// Create the type of element you pass in the parameters
const createNode = (element) => {
    return document.createElement(element); 
}

// Append the second parameter(element) to the first one
const appendElement = (parent, el) => {
    return parent.appendChild(el); 
}

// Function to get data from database
const updateTable = async (url = ``) => {
    table = document.getElementsByTagName("table")[0];
    tbody = table.getElementsByTagName("tbody")[0];
    const response = await fetch(url);
    let rows = await response.json();
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

// Check if it is a touch screen or not
const isTouchScreen = () => {
    return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

// Helper function to check if point lies on the ellipse or not
const checkPoint = (h, k, x, y, r) => { 
    p = (pow((x - h), 2) / pow(r, 2)) 
            + (pow((y - k), 2) / pow(r, 2)); 
    return p; 
} 
