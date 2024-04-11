let addToy = false;
let mainDiv = document.getElementById('toy-collection');

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");

    fetchToys();
    addNewToy();

    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
        } else {
            toyFormContainer.style.display = "none";
        }
    });
});

function fetchToys() {
    fetch('http://localhost:3000/toys')
        .then(response => response.json())
        .then(toys => {
            toys.forEach(toy => {
                createDiv(toy);
            });
        });
}

function createDiv(toy) {
    mainDiv.innerHTML += `<div class="card">
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
    </div>`;
    
    mainDiv.addEventListener('click', (e) => {
      if (e.target.classList.contains('like-btn')) {
          likesIncrement(e);
      }
  });
}

function addNewToy() {
    document.getElementsByClassName('add-toy-form')[0].addEventListener('submit', (e) => {
        e.preventDefault(); 
        postToy();
    });
}

function postToy() {
    const object = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "name": "Jessie",
            "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
            "likes": 0
        })
    };

    fetch('http://localhost:3000/toys', object)
        .then(response => response.json())
        .then(toy => {
            createDiv(toy);
        });
}

function likesIncrement(e) {
    let numLikes = parseInt(e.target.previousElementSibling.innerText);
    let currentLikes = numLikes + 1;
    fetch(`http://localhost:3000/toys/${e.target.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "likes": currentLikes
        })
    })
    .then(res => res.json())
    .then((likesObject) => {
        e.target.previousElementSibling.innerText = `${currentLikes} Likes`;
    });
}