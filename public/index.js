async function loadParagraphs() {
    const response = await fetch('http://localhost:3000/paragraph',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json();
    console.log(myJson)
}

loadParagraphs();