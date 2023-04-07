const inputFormSubmit = document.querySelector("#movie-form-submit")
const modalContainer = document.querySelector(".modal-container")
let rating =""
/*This line of code closes the modal pop-up */
document.querySelector("#modal-close-btn,#modal-content,.modal-container").addEventListener("click", ()=>{
  document.querySelector(".modal-container").style.display ="none"
})


/*This take control of the star icon and get its value */
const stars = document.querySelectorAll(".star-rating .fa-star")
stars.forEach((star, index) => {
  star.addEventListener('click', () => {

    for (let i = 0; i <= index; i++) {
      stars[i].classList.add('checked')
    }

    for (let i = index + 1; i < stars.length; i++) {
      stars[i].classList.remove('checked')
    }
    rating = ((index + 1)*2)
  
  });
});

const loader = document.querySelector("#loader");

/*This block validate the form */
inputFormSubmit.addEventListener("click",(e)=>{
  e.preventDefault()

  // Show the loader
  loader.style.display = "block";

  const movieNameInput = document.querySelector("#search-bar").value
  const genreNameInput = document.querySelector("#genre").value

  let hasCheckedClass = false;
  stars.forEach(star => {
    if (star.classList.contains('checked')) {
      hasCheckedClass = true;
    }
  });

  if(movieNameInput == "" && genreNameInput == "" && !hasCheckedClass){
    alert("Please enter something, so we can recommend a movie for you")
    loader.style.display = "none"; // Hide the loader
    return false
  }

  async function fetchData() {
    fetch(`https://moviezoneproject-production.up.railway.app/movies/?genres=${genreNameInput}&user_rating=${rating}&title=${movieNameInput}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        else{
          return res.json()
        }
      })
      /*This block display the output */
      .then(data=>{
        document.querySelector("#display-div").innerHTML = `
                                                          <button type="button" id="display-div-btn">X</button>
                                                          <h3>${data.name}</h3>
                                                          <button><a href="${data.url}" target="_blank">Get Movie<a></button>`
        loader.style.display = "none"; // Hide the loader
        document.getElementById("display-div").style.display= "flex"
        document.querySelector("#display-div-btn").addEventListener("click", ()=>{
          document.querySelector("#display-div").style.display ="none"
        })
      })
      .catch((error) => {
        console.log("Error fetching data:", error)
        loader.style.display = "none"; // Hide the loader
      })
  }
  fetchData()
})
