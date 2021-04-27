async function loadParagraphs() {
    const response = await fetch('http://localhost:3000/paragraph',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json();
    myJson.array.forEach(element => {
        
    });
}

async function addParagraph() {
    const response = await fetch('http://localhost:3000/paragraph',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            paragraph: document.getElementById("paragraph").value
        })
    });
    console.log(response);
}

loadParagraphs();