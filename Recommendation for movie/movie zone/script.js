import videojs from 'video.js';


const inputFormSubmit = document.querySelector("#movie-form-submit")
const modalContainer = document.querySelector(".modal-container")
let rating = ""
/*This line of code closes the modal pop-up */
document.querySelector("#modal-close-btn,#modal-content,.modal-container").addEventListener("click", () => {
    modalContainer.style.display = "none"
})


/*This take control of the star icon and get its value */
const stars = document.querySelectorAll(".star-rating .fa-star");
let highestCheckedIndex = -1;

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    if (stars[index].classList.contains("checked")) {
      for (let i = index; i < stars.length; i++) {
        stars[i].classList.remove("checked");
      }
      highestCheckedIndex = index - 1; // update highestCheckedIndex to the index of the last checked star
    } else {
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add("checked");
      }
      highestCheckedIndex = index; // update highestCheckedIndex to the index of the current clicked star
    }
    for (let i = index + 1; i < stars.length; i++) {
      stars[i].classList.remove("checked");
    }
    rating = (highestCheckedIndex + 1) * 2;
  });
});



const loader = document.querySelector("#loader");

function modalAndLoader() {
    loader.style.display = "none"; // Hide the loader
    document.getElementById("display-div-container").style.display = "flex"
    document.querySelector("#display-div-btn").addEventListener("click", () => {
        document.querySelector("#display-div-container").style.display = "none"
        document.querySelector("#movie-iframe").src = ""
    })
}

 //This block handles play-pause function when watch movie button is clicked

 
function playPauseNavHandler(){
  // Initialize Video.js on the iframe
let iframe = document.getElementById('my-iframe');
let player = videojs(iframe);

// Pause the video when the user navigates away from the page
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === 'hidden') {
    player.pause();
  } else {
    player.play();
  }
});

// Pause the video when the user opens a new tab
window.addEventListener('blur', function() {
  player.pause();
});

// Resume the video when the user comes back to the page
window.addEventListener('focus', function() {
  player.play();
});

}




/*This block validate the form */
inputFormSubmit.addEventListener("click", (e) => {
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

    if (movieNameInput == "" && genreNameInput == "" && ! hasCheckedClass) {
        alert("Please enter something, so we can recommend a movie for you")
        loader.style.display = "none"; // Hide the loader
        return false
    }

   
      
      
    async function fetchData() {
        fetch(`https://moviezoneproject-production-660d.up.railway.app/movies/?genres=${genreNameInput}&user_rating=${rating}&title=${movieNameInput}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${
                    res.status
                }`)
            } else {
                return res.json()
            }
        })
        
        /*This block display the output */
       .then(data => {
            if (Object.keys(data).length > 0) {
                document.getElementById("movie-iframe").poster = data.thumbnail != null ? data.thumbnail : ""
                document.getElementById("movie-iframe").src = data.trailer_embed != null ? `${data.trailer_embed}?autoplay=false&width=320` : ""
                document.getElementById("movie-iframe").style.display = data.trailer_embed != null ? "block" : "none"
                document.getElementById("movie-image").src = data.image != null ? data.image : data.message ? "https://wpmedia-lib.larryjordan.com/wp-content/uploads/2022/06/Relink_02.jpg": ""
                document.getElementById("movie-image").style.display = data.trailer_embed == null ? "block" : "none"
                document.getElementById("title").textContent = data.name
                document.getElementById("plot").textContent = data.plot != null ? data.plot : " "
                document.getElementById("movie-link").href = data.url != null ? data.url : ""
                document.getElementById("movie-button").style.display = data.url ? "block" : "none"
                document.getElementById("message").textContent = data.message? data.message : ""
                modalAndLoader()
                playPauseNavHandler()
            }
        })
        .catch((error) => {
            console.log("Error fetching data:", error)
            document.getElementById("movie-button").style.display = "none"
            modalAndLoader()
        })
    }
    fetchData()

})

