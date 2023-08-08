var loading = false;
var after = '';
var subreddit = '';
var displayedImages = new Set();
var firstImageUrls = { url1: '', url2: '' };

function isInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleSelectionTiles() {
  const celebGrid = document.getElementById('celebGrid');
  const celebItems = Array.from(celebGrid.getElementsByClassName('celeb-item'));
  shuffleArray(celebItems);

  celebItems.forEach((item) => {
    celebGrid.appendChild(item);
  });
}

window.addEventListener('load', function() {
  shuffleSelectionTiles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('imageResults').innerHTML = '';
});

function loadPosts(subreddit, after = '') {
  if (!subreddit || loading) return;
  loading = true;

  var url1 = `https://www.reddit.com/r/celebhub+celebnsfw/search.json?q=${subreddit}&restrict_sr=on&sort=top&include_over_18=true&after=${after}`;
  // var url2 = ''
  var url2 = `https://www.reddit.com/r/${subreddit.replace(/[\s-]/g, '')}.json?sort=top&include_over_18=true&after=${after}`;

  fetch(url1)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.data.children.length > 0) {
        if (firstImageUrls.url1 && firstImageUrls.url1 === data.data.children[0].data.url_overridden_by_dest) {
          console.log('No more new images from url1');
        } else {
          firstImageUrls.url1 = data.data.children[0].data.url_overridden_by_dest;
          processFetchedData(data);
        }
      }
    })
    .catch(function(error) {
      console.log('Error:', error);
      loading = false;
    });
  
  fetch(url2)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.data.children.length > 0) {
        if (firstImageUrls.url2 && firstImageUrls.url2 === data.data.children[0].data.url_overridden_by_dest) {
          console.log('No more new images from url2');
        } else {
          firstImageUrls.url2 = data.data.children[0].data.url_overridden_by_dest;
          processFetchedData(data);
        }
      }
    })
    .catch(function(error) {
      console.log('Error:', error);
      loading = false;
    });
}

// function processFetchedData(data) {
//   var imageResults = document.getElementById('imageResults');

//   after = data.data.after;

//   var children = data.data.children;

//   shuffleArray(children);

//   children.forEach(function(child) {
//     var mediaUrl = child.data.url_overridden_by_dest;
//     var mediaType = child.data.post_hint;

//     if ((mediaType === 'image' || mediaType === 'gif') && !displayedImages.has(mediaUrl)) {
//       displayedImages.add(mediaUrl);
//       var tempImage = new Image();
//       tempImage.src = mediaUrl;
//       tempImage.onload = function() {
//         var imageWidth = tempImage.width;
//         var imageHeight = tempImage.height;

//         if (imageWidth > 180 && imageHeight > 100) {
//           if (isInViewport(tempImage)) {
//             var mediaContainer = document.createElement('div');
//             mediaContainer.className = 'media';

//             var media = document.createElement('img');
//             media.src = mediaUrl;
//             media.alt = child.data.title;
//             media.style.maxHeight = '80vh';
//             mediaContainer.appendChild(media);

//             imageResults.appendChild(mediaContainer);
//           }
//         }
//       };
//     } else if (mediaType === 'gallery') {
//       var galleryItems = child.data.gallery_data.items;

//       galleryItems.forEach(function(galleryItem) {
//         var mediaUrl = galleryItem.url;

//         if (!displayedImages.has(mediaUrl)) {
//           displayedImages.add(mediaUrl);
//           var tempImage = new Image();
//           tempImage.src = mediaUrl;
//           tempImage.onload = function() {
//             var imageWidth = tempImage.width;
//             var imageHeight = tempImage.height;

//             if (imageWidth > 180 && imageHeight > 100) {
//               if (isInViewport(tempImage)) {
//                 var mediaContainer = document.createElement('div');
//                 mediaContainer.className = 'media';

//                 var media = document.createElement('img');
//                 media.src = mediaUrl;
//                 media.alt = child.data.title;
//                 media.style.maxHeight = '80vh';
//                 mediaContainer.appendChild(media);

//                 imageResults.appendChild(mediaContainer);
//               }
//             }
//           };
//         }
//       });
//     }
//   });

//   loading = false;
// }

function processFetchedData(data) {
  var imageResults = document.getElementById('imageResults');

  after = data.data.after;

  var children = data.data.children;

  shuffleArray(children);

  children.forEach(function(child) {
    if (child.data.is_gallery) {
    Object.values(child.data.media_metadata).forEach(function(mediaItem) {
      var mediaUrl = decodeURIComponent(mediaItem.s.u);
    
      if (!displayedImages.has(mediaUrl)) {
        var manipulatedMediaUrl = mediaUrl.split('?')[0].replace('preview', 'i');
        displayedImages.add(manipulatedMediaUrl);
            
        var tempImage = new Image();
        tempImage.src = manipulatedMediaUrl;
          tempImage.onload = function() {
            var imageWidth = tempImage.width;
            var imageHeight = tempImage.height;

            if (imageWidth > 180 && imageHeight > 100) {
              if (isInViewport(tempImage)) {
                var mediaContainer = document.createElement('div');
                mediaContainer.className = 'media';

                var mediaType;
                switch (tempImage.src.split('.').pop()) {
                  case 'gif':
                    mediaType= 'gif';
                    break;
                  default:
                    mediaType= 'image';
                }

                var mediaElement =
                  (mediaType === 'image') ? 
                  document.createElement('img') : 
                  document.createElement('video');

                if (mediaType === 'image') {
                  mediaElement.src=manipulatedMediaUrl;
                  }
                 else{
                   const source=document.createElement("source");
                   source.type="video/mp4";
                   source.src=tempImage.src.replace(/&amp;/g, '&');
                   mediaElement.appendChild(source);
                 }
                  
                mediaElement.alt = child.data.title;
                mediaElement.style.maxHeight = '80vh';
                mediaContainer.appendChild(mediaElement);

                imageResults.appendChild(mediaContainer);
              }
            }
          };
        }
      });
    } else {
      var mediaUrl = child.data.url_overridden_by_dest;
      var mediaType = child.data.post_hint;

      if ((mediaType === 'image' || mediaType === 'gif') && !displayedImages.has(mediaUrl)) {
        displayedImages.add(mediaUrl);
        var tempImage = new Image();
        tempImage.src = mediaUrl;
      tempImage.onload = function() {
        var imageWidth = tempImage.width;
        var imageHeight = tempImage.height;

        if (imageWidth > 180 && imageHeight > 100) {
          if (isInViewport(tempImage)) {
            var mediaContainer = document.createElement('div');
            mediaContainer.className = 'media';

            var media = document.createElement('img');
            media.src = mediaUrl;
            media.alt = child.data.title;
            media.style.maxHeight = '80vh';
            mediaContainer.appendChild(media);

            imageResults.appendChild(mediaContainer);
          }
        }
      }
      };
    }
  });

  loading = false;
}

window.addEventListener('scroll', function() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 2000) {
    loadPosts(subreddit, after);
  }
});

function showCelebrityImages(celebrityName, celebrityNameElement) {
  clearSearch()
  var celebName = celebrityNameElement.textContent.trim();
  var pageTitle = "Celeb Hub - " + celebName;
  var h1Element = document.querySelector("h1");
  var pageTitleElement = document.querySelector("title");

  h1Element.textContent = pageTitle;
  pageTitleElement.textContent = pageTitle;
  
  subreddit = celebrityName;
  after = '';
  imageResults.innerHTML = '';
  document.getElementById('celebGrid').style.display = 'none';
  loadPosts(subreddit);
  imageResults.innerHTML = '';
  document.getElementById('imageResults').style.display = 'flex';
}
