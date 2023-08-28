let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  const toyBox= document.querySelector("#toy-collection")

  // fetches and creates cards from existing file
  fetch('http://127.0.0.1:3000/toys')
  .then( response => response.json())
  .then(data =>{
    for(const item in data){
      toyBox.appendChild(createCard(data[item]));
    }
  })
  .catch(error => console.log(error));
  const form = document.querySelector(".add-toy-form");

  // Posts the new toy to the json file and creates the card for the html
  form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const nameAndUrl = document.querySelectorAll(".input-text");
    const toyObj = {
      "name":nameAndUrl[0].value,
      "image":nameAndUrl[1].value,
      "likes":0
    };
    fetch('http://127.0.0.1:3000/toys',{
      method:'POST',
      headers:{
        "Content-Type":"application/json",
        Accept: "application/json"
      },
      body:JSON.stringify(toyObj)
    })
    .then(response => response.json())
    .then(data => {
      toyBox.appendChild(createCard(data))
    })
    .catch(error => console.log(error));
    nameAndUrl[0].value = '';
    nameAndUrl[1].value = '';
    addToy = !addToy;
    toyFormContainer.style.display = "none";
  })
});
// creates an easy way to create cards (and their like event listener) and return them to be appended where needed
function createCard(obj){
  const card = document.createElement("div")
  card.classList.add("card")
  const name = document.createElement("h2")
  name.textContent= obj.name;
  const image = document.createElement("img")
  image.src = obj.image
  image.classList.add('toy-avatar')
  const likes = document.createElement("p")
  likes.textContent = obj.likes + " likes"
  const likeBtn = document.createElement("button")
  likeBtn.classList.add('like-btn')
  likeBtn.id = obj.id
  likeBtn.textContent = "Like ❤️"
  likeBtn.addEventListener('click',()=>{
    obj.likes+=1
    fetch(`http://127.0.0.1:3000/toys/${obj.id}`,{
      method:'PATCH',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
      likes.textContent = data.likes + " likes"
    })
    .catch(error=> console.log(error));
  }
    
  )
  card.appendChild(name)
  card.appendChild(image)
  card.appendChild(likes)
  card.appendChild(likeBtn)
  return card
}
