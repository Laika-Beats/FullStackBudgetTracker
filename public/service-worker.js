//cache for no internet connection
const CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

//Array of all the URLS
const urlsToCache = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
  ];

  self.addEventListener("fetch", function(event) {
 
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
            //try fetching normally 
          return fetch(event.request)
            .then(response => {
                //store cache if the response was ok
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
  
            //if the response fails it will pull the correct data from the cache
            .catch(err => {
              
              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }

    //block handles all home page calls 
    event.respondWith(
        fetch(event.request).catch(function() {
          return caches.match(event.request).then(function(response) {
            if (response) {
              return response;
            } else if (event.request.headers.get("accept").includes("text/html")) {
              
              return caches.match("/");
            }
          });
        })
      );
    });
