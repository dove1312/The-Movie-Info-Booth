const movieApp = {};
const searchTerm = document.getElementById('search-input');

movieApp.baseUrl = 'https://api.themoviedb.org/3';
movieApp.apiKey = 'fdc64670b61843a5841c94be98a6df3b';
movieApp.mainUrl = movieApp.baseUrl + '/discover/movie?sort_by=popularity.desc&api_key=' + movieApp.apiKey;
movieApp.imageUrl = `https://image.tmdb.org/t/p/w500`;
movieApp.search = `https://api.themoviedb.org/3/search/movie?api_key=fdc64670b61843a5841c94be98a6df3b&query=${searchTerm}`;
movieApp.searchURL = movieApp.baseUrl + '/search/movie?api_key=' + movieApp.apiKey;

// movieApp.getMovies('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fdc64670b61843a5841c94be98a6df3b');

movieApp.init = () => {
    movieApp.getPopularMovies();
    movieApp.searchFunction();
    
}

movieApp.getMovies = (url) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=fdc64670b61843a5841c94be98a6df3b&query=${url}`)
        .then((response)=>{
            return response.json();
        })
        .then((jsonResponse)=>{
            movieApp.displayMovies(jsonResponse);
        })
};

movieApp.getPopularMovies = () => {
    fetch(movieApp.mainUrl)
        .then((response)=>{
            return response.json();
        })
        .then((jsonResponse)=>{
            movieApp.displayMovies(jsonResponse);
        })
};


movieApp.searchFunction = function(){
    const searchButton = document.querySelector('button')

    searchButton.addEventListener('click', function(){
        movieApp.getMovies(searchTerm.value)
    })
    
}


movieApp.displayMovies = (dataFromApi) => {
    const details = document.querySelector('.resultsContainer');
        
    details.innerHTML = "";
    
    // console.log(dataFromApi)
    
    dataFromApi.results.forEach((imageObject) => {
        
        const moviePoster = document.createElement('img');
        moviePoster.src = movieApp.imageUrl + imageObject.poster_path;
        details.appendChild(moviePoster);
        moviePoster.classList.add('imageBox');
        
        const movieDetails = document.createElement('div');
        details.appendChild(movieDetails);
        movieDetails.classList.add('textBox');
        
        const name = document.createElement('h3');
        name.textContent = imageObject.title;
        movieDetails.appendChild(name);

        const description = document.createElement('p');
        description.textContent = imageObject.overview;
        movieDetails.appendChild(description);

        const rating = document.createElement('p');
        rating.textContent = imageObject.vote_average + ' / 10';
        movieDetails.appendChild(rating);

        const btnTrailer = document.createElement('button');
        btnTrailer.classList.add('watchTrailer');
        btnTrailer.textContent = "Watch Trailer";
        btnTrailer.id = imageObject.id;
        movieDetails.appendChild(btnTrailer);

        btnTrailer.addEventListener('click', () => {
            
            movieApp.openNav(imageObject);
        })

    });
};

let trailerContent = document.getElementById('movieDiv');

movieApp.openNav = (imageObject) => {
    let movieID = imageObject.id;
    
    fetch(movieApp.baseUrl + '/movie/' + movieID + '/videos?api_key=' + movieApp.apiKey)
        .then ( (res) => {
            return res.json();
        })
        .then ( (jsonRes) => {
            
            if (jsonRes) {
                // Open the overlay
                
                document.getElementById("overlayTrailer").style.height = "100%";
                
                if (jsonRes.results.length > 0 ) {
                    jsonRes.results.forEach( (item) => {
                        if (item.type === "Trailer") {
                            let embed = `
                            <iframe width="660" height="415" src="https://www.youtube.com/embed/${item.key}" title="${item.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            `;
                        
                    trailerContent.innerHTML = embed;    
                        }
                    })
                } else {
                    trailerContent.innerHTML = alert("No results found!");
                } 
            } 
        })
}

/* Close overlay */
movieApp.closeNav = () => {
  document.getElementById("overlayTrailer").style.height = "0%";
}

movieApp.init();