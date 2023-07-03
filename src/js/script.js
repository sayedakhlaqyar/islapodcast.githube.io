// LIGHT AND DARK MODE

const lightBtn = document.querySelector(".toggleLight_btn");
const bodyTheme = document.querySelector("body");

window.addEventListener("load", () => {
  let getThemeClrs = localStorage.getItem("theme");

  if (getThemeClrs == "light") {
    bodyTheme.classList.remove("dark");
  } else {
    bodyTheme.classList.add("dark");
  }
});

lightBtn.addEventListener("click", () => {
  let themeIcon = lightBtn.firstElementChild;
  let themeText = lightBtn.firstElementChild.innerHTML;

  if (bodyTheme.classList.contains("dark")) {
    bodyTheme.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    bodyTheme.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }

  if (themeText == "light_mode") {
    themeIcon.innerHTML = "dark_mode";
  } else {
    themeIcon.innerHTML = "light_mode";
  }
});

// GET ALL DATA FROM SANITY
let musicAud = new Audio();

let globalCurrentTime;
const dataSet = "production";
const projectId = "yyb5btl6";
const query = encodeURIComponent("*[_type=='post']");

const sanityURL = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataSet}?query=${query}`;
const getAlldata = () => {
  fetch(sanityURL)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      showData(data);
    });
};

getAlldata();

const podcastContainer = document.querySelector(".podcasts_container");
// console.log(podcastContainer);

const showData = (data) => {
  data.result.forEach((element, index) => {
    let show = `
     <div class="podcast_box">
    <h2>${element.title}</h2>
    <small class="uploadedate">Uploaded On: ${element.date}</small>
    <div class="podcast_main_player">
      <div class="podcast_player">
        <div class="audio_img">
          <img src="src/images/big_logo2.png" alt="" />
        </div>
        <div class="right_side">
          <p> STILL WORKING OOOOOON And New Updates are coming </p>
          <h2>${element.title}</h2>
          <div class="audio_player">
            <button class="playbtn" id="${element.audio.asset._ref}" data-id="${index}">
              <i class="ri-play-fill"></i>
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value="0"
              class="custom-range"
            />
            <div class="audio_time">
              <small class="current-time">00:00</small>
              <small class="end-time">00:00</small>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_links">
        <button class="downloadbtn"  id="${element.audio.asset._ref}" data-id="${index}">
            <i class="ri-download-line"></i>
         </button>

      <button class="sharebtn">
          <i class="ri-share-line"></i>
      </button>

      <div class="loader_conttainer">
      <div class="loader"></div>
    </div>

      
      </div>
    </div>
    <p>
    ${element.extra}
    </p>
    <button class="view_btn">View Episode</button>
  </div>
    
    `;

    podcastContainer.insertAdjacentHTML("beforeend", show);
  });
  const musicCurrTime = document.querySelectorAll(".current-time");
  const musicEndTime = document.querySelectorAll(".end-time");
  const allPlayBtns = document.querySelectorAll(".playbtn");
  const progressBar = document.querySelectorAll(".custom-range");
  allPlayBtns.forEach((play) => {
    play.addEventListener("click", (e) => {
      stopMusic(play);

      allPlayBtns.forEach((btn) => {
        btn.classList.remove("active");
      });

      let playIcon = play.firstElementChild;

      if (playIcon.classList.contains("ri-play-fill")) {
        playIcon.classList.replace("ri-play-fill", "ri-pause-fill");
        play.classList.add("active");

        let audioPath = play.id;
        let currentBtnId = play.getAttribute("data-id");

        let audioId = audioPath.split("-")[1];
        let audioExt = audioPath.split("-")[2];
        let audioFullPath = `${audioId}.${audioExt}`;

        musicAud.src = `https://cdn.sanity.io/files/yyb5btl6/production/${audioFullPath}`;
        musicAud.play();

        // when the music is playing we want the progressbar to be updated
        musicAud.addEventListener("timeupdate", () => {
          progressBar.forEach((barItem) => (barItem.value = 0));
          let percent = Math.floor(
            (musicAud.currentTime / musicAud.duration) * 100
          );
          let currentTime = Math.floor(musicAud.currentTime);
          let duration = Math.floor(musicAud.duration);

          progressBar[currentBtnId].value = percent;

          // music end time
          let min = Math.floor(duration / 60);
          let sec = Math.floor(duration % 60);

          if (sec < 10) {
            sec = `0${sec}`;
          }
          musicEndTime.forEach((endTime) => (endTime.textContent = "00:00"));
          musicEndTime[currentBtnId].textContent = `${min}:${sec}`;

          // music start Time
          let min1 = Math.floor(currentTime / 60);
          let sec1 = Math.floor(currentTime % 60);
          if (sec1 < 10) {
            sec1 = `0${sec1}`;
          }
          musicCurrTime.forEach((currTime) => (currTime.textContent = "00:00"));
          musicCurrTime[currentBtnId].textContent = `${min1}:${sec1}`;
          globalCurrentTime = currentTime;
        });

        // when the progressbar is changed we want the music to move forward to the progressbar value
        progressBar[currentBtnId].addEventListener("change", () => {
          musicAud.currentTime = Math.floor(
            (progressBar[currentBtnId].value * musicAud.duration) / 100
          );
        });
      } else {
        playIcon.classList.replace("ri-pause-fill", "ri-play-fill");
        musicAud.currentTime = globalCurrentTime;
        musicAud.pause();
      }
    });
  });
  // DOWNLOAD BUTTON
  const downloadBtn = document.querySelectorAll(".downloadbtn");
  const loader = document.querySelector(".loader");

  downloadBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      let audioPath = btn.id;

      let audioId = audioPath.split("-")[1];
      let audioExt = audioPath.split("-")[2];
      let audioFullPath = `${audioId}.${audioExt}`;
      musicAud.src = `https://cdn.sanity.io/files/yyb5btl6/production/${audioFullPath}`;

      loader.classList.add("active");
      fetch(musicAud.src)
        .then((res) => res.blob())
        .then((blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "Hope you learn something from it ";
          a.click();

          loader.classList.remove("active");
        });
    });
  });
};

function stopMusic() {
  musicAud.pause();
  musicAud.currentTime = 0;
}

// PLAY AUDIO

// function playAudio(audio, progressBar, musicCurrTime, musicEndTime, element) {
//   const currentBtnId = element;

//   let audioPath = audio;

//   let audioId = audioPath.split("-")[1];
//   let audioExt = audioPath.split("-")[2];
//   let audioFullPath = `${audioId}.${audioExt}`;

//   musicAud.src = `https://cdn.sanity.io/files/yyb5btl6/production/${audioFullPath}`;
//   // musicAud.play();

//   // music timeupdate
//   musicAud.addEventListener("timeupdate", () => {
//     let percent = Math.floor((musicAud.currentTime / musicAud.duration) * 100);
//     let currentTime = Math.floor(musicAud.currentTime);
//     let duration = Math.floor(musicAud.duration);
//     progressBar.value = percent;

//     // music end time
//     let min = Math.floor(duration / 60);
//     let sec = Math.floor(duration % 60);

//     if (sec < 10) {
//       sec = `0${sec}`;
//     }
//     musicEndTime.textContent = `${min}:${sec}`;

//     // music start Time
//     let min1 = Math.floor(currentTime / 60);
//     let sec1 = Math.floor(currentTime % 60);
//     if (sec1 < 10) {
//       sec1 = `0${sec1}`;
//     }
//     musicCurrTime.textContent = `${min1}:${sec1}`;
//   });

//   progressBar.addEventListener("change", () => {
//     musicAud.currentTime = Math.floor(
//       (progressBar.value * musicAud.duration) / 100
//     );
//   });
// }

// DOM Elements
const openModalBtns = document.querySelectorAll("[data-modal-open]");
const closeModalBtns = document.querySelectorAll("[data-close-modal]");
const overlay = document.querySelector("[data-overlay]");
openModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = document.querySelector(btn.dataset.modalOpen);
    openModal(modal);
  });
});

closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    closeModal(modal);
  });
});

// open modal
function openModal(modal) {
  if (modal === null) return;
  if (modal.id === "modalSearch") {
    modal.classList.add("active");
    overlay.classList.remove("show");
  } else {
    modal.classList.add("active");
    overlay.classList.add("show");
  }
}

// close modal
function closeModal(modal) {
  if (modal === null) return;
  if (modal === devPopup) {
    devPopup.classList.remove("animate");
    mobNumberField.classList.remove("active");
    overlay.style.transition = "0.25s ease-in-out 0.15s";
  }
  modal.classList.remove("active");
  overlay.classList.remove("show");
}

// whatsapp
const devPopup = document.querySelector(".dev__popup");
const socLinkBtns = document.querySelectorAll(".dev__popup .social__links li");
const mobNumberField = document.querySelector(".dev__popup .input__field");
const mobNumber = mobNumberField.querySelector(".mob__number");
const copyMobNumber = mobNumberField.querySelector(
  ".dev__popup .copy__mob__number"
);
const msgPopup = document.querySelector(".text__message");

socLinkBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (btn.classList.contains("btn__whatsapp")) {
      e.preventDefault();

      devPopup.classList.add("animate");
      mobNumberField.classList.add("active");
    }
  });
});

// copy whatsapp mobile number
copyMobNumber.addEventListener("click", () => {
  navigator.clipboard.writeText(mobNumber.value);

  msgPopup.classList.add("active");
  msgPopup.innerHTML =
    '<p><i class="fa fa-check"></i> Copied successfully!</p>';

  setTimeout(() => {
    msgPopup.classList.remove("active");
  }, 800);
});

//overlay
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("show");
    mobMenu.classList.remove("active");
    devPopup.classList.remove("active");
    devPopup.classList.remove("animate");
    mobNumberField.classList.remove("active");
  }
});

const navbarUl = document.querySelector(".nav_bar ul");
const menuBtn = document.querySelector(".menu_btn");

menuBtn.addEventListener("click", () => {
  const menuIcon = menuBtn.firstElementChild;

  console.log(menuIcon);

  if (menuIcon.classList.contains("ri-menu-fill")) {
    menuIcon.classList.add("ri-close-fill");
    menuIcon.classList.remove("ri-menu-fill");
    navbarUl.classList.add("active");
  } else {
    menuIcon.classList.add("ri-menu-fill");
    navbarUl.classList.remove("active");
    menuIcon.classList.remove("ri-close-fill");
  }
});

// DOM ELEMENTS
const userName = document.querySelector(".user_name");

window.addEventListener("load", () => {
  let getUsername = localStorage.getItem("userName");
  if (!getUsername) {
    userName.innerHTML = "Your Name";
  } else {
    userName.innerHTML = getUsername;
  }
});
userName.addEventListener("blur", () => {
  let setUserName = localStorage.setItem("userName", userName.textContent);
  let getUsername = localStorage.getItem("userName");
  if (!getUsername) {
    userName.innerHTML = "Your Name";
  } else {
    userName.innerHTML = getUsername;
  }
});

const closeBtn = document.querySelector(".close_btn");

closeBtn.addEventListener("click", () => {
  readMorePop.classList.remove("active");
  readPopOverlay.classList.remove("active");
});

const API_AUTH =
  "372661390899-dgtj0vf6kj3j7jj1t4cffbf2334daf1f.apps.googleusercontent.com";
