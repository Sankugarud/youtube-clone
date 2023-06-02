const search = document.getElementById("sb");
const api = "AIzaSyA99uAlCuVwF0H_PfTxzPciYESSB7bdmG0";
localStorage.setItem("api_key", api);
let ytcontent = document.getElementsByClassName("ytcontent");

function getinput() {
  let searchValue = search.value;
  console.log(searchValue);
  fetchVideos(searchValue);
  searchValue.value="";
}

async function fetchVideos(searchValue) {
  let apiCall = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchValue}&key=${api}`;
  try {
    let response = await fetch(apiCall);
    let result = await response.json();
    for (let i = 0; i < result.items.length; i++) {
      let video = result.items[i];
      console.log(video);
      let videoStats = await fetchStats(video.id.videoId);
      if (videoStats.items.length > 0) {
        result.items[i].duration  = videoStats.items[0] && videoStats.items[0].contentDetails.duration;
      }
    }
    showContent(result.items);
  } catch (error) {
    alert(error);
  }
}

function getView(n) {
  if (n < 1000) {
    return n;
  } else if (n >= 1000 && n <= 999999) {
    n /= 1000;
    n = parseInt(n);
    return n + "k";
  }
  return parseInt(n / 1000000) + "M";
}

function showContent(items) {
  for (let i = 0; i < items.length; i++) {
    let videoItem = items[i];
    let imgUrl = videoItem.snippet.thumbnails.high.url;
    let videoElement = document.createElement("div");

    videoElement.addEventListener("click", () =>{
      nevigateToVideo(videoItem.id.videoId);
    })

    videoElement.className = "div-content";
    let videoChildren = `
      <img class="thmb-img" src="${imgUrl}"/>
      <p class="title">${videoItem.snippet.title}</p>
      <p class="channel-name">${videoItem.snippet.channelTitle}</p>
      <p class="view-count">${videoItem.videoStats ? getView(videoItem.videoStats.viewCount) : "NA"}</p>
    `;
    videoElement.innerHTML = videoChildren;
    ytcontent[0].append(videoElement);
  }
  
}

async function fetchStats(videoId) {
  const apiCall = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${api}`;
  let response = await fetch(apiCall);
  let result = await response.json();
  return result;
}
function nevigateToVideo(videoId){
  let path = `./video.html`;
  if(videoId){
    document.cookie = `video_id=${videoId}; path=${path}`
    let linkItem = document.createElement("a");
    linkItem.href= "http://127.0.0.1:5501/video.html#";
    linkItem.target = "_blank";
    linkItem.click();
  }else{
    console.log("page is not found");
  }

}