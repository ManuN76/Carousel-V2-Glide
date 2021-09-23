window.function = function (img, legend, fit, shortcuts, time, zoompan) {
  // img
  img = img.value ?? "";
  if (img == "") return;
  let imgs = img.split(",");

  // legend
  legend = legend.value ?? "";
  let legends = legend.split(",");

  // fit
  fit = fit.value ?? "";
  fit = fit.toLowerCase();

  let objectFit = "cover";

  switch (objectFit) {
    case "fill":
    case "cover":
    case "contain":
    case "scale-down":
    case "none":
      objectFit = fit;
      break;
    default:
      objectFit = "cover";
  }

  // shortcuts
  shortcuts = shortcuts.value ?? "";
  shortcuts = shortcuts.toLowerCase().trim();

  let dotEnable = 0;
  let thumbnailEnable = 0;

  if (shortcuts.search("dot") > -1) {
    dotEnable = 1;
  }

  if (shortcuts.search("thumbnail") > -1) {
    thumbnailEnable = 1;
  }

  // time
  time = time.value ?? 0;
  time = Math.abs(time) * 1000;

  // zoompan
  let zoompanActif = zoompan.value ?? 0;

  // HTML
  let htmlImg = "";
  let htmldot = "";
  let htmlthumbnail = "";

  for (let i = 0; i < imgs.length; i++) {
    let caption = "";
    let leg = "";
    if (legends.length > i) {
      if (legends[i].trim() != "") {
        leg = legends[i].trim();
        caption = `<div class="text">${leg}</div>`;
      }
    }

    htmlImg += `<span class="slide"><img src="${imgs[i]}" alt="" id="img${i}" class="myImg"/>${caption}</span>
   `;

    if (dotEnable)
      htmldot += `<span class="dot" onclick="showSlides(${i})"></span>`;

    if (thumbnailEnable)
      htmlthumbnail += `<span><img class="thumbnailImg" src="${imgs[i]}" alt="" onclick="showSlides(${i})" /></span>`;
  }

  let ht = `<!DOCTYPE html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://unpkg.com/@panzoom/panzoom@4.4.1/dist/panzoom.min.js"></script>
  </head>
  <html>
  <style>
  :root {
    --objectFit: cover;
    /* cover, fill, contain, scale-down, none */
  }
  
  .slider {
    /* no style */
    z-index: 0;
  }
  
  .wrapper {
    overflow: hidden;
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100vh;
    border-radius: 15px;
  }
  
  /**************************** 
  *           Slide
  *****************************/
  
  #items {
    width: 10000px;
    position: relative;
    top: 0;
    left: -100vw;
  }
  
  #items.shifting {
    transition: left 0.7s ease-out;
  }
  
  .slide {
    width: 100vw;
    height: 100vh;
    cursor: pointer;
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 1s;
    position: relative;
  }
  
  .slide img {
    width: calc(100vw - 15px);
    height: calc(100vh - 10px);
    margin-top: -8px;
    border-radius: 15px;
    object-fit: var(--objectFit);
  }
  
  /**************************** 
  *       Previous, Next
  *****************************/
  .control {
    display: block;
    position: absolute;
    top: 50%;
    border-radius: 20px;
    margin-top: -20px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
  
  .control-off {
    display: none;
  }
  
  .prev {
    left: -20px;
  }
  
  .next {
    right: -20px;
  }
  
  .prev,
  .next {
    cursor: pointer;
    position: absolute;
    top: 45%;
    width: auto;
    padding: 16px;
    color: rgb(250, 232, 232);
    font-weight: bold;
    font-size: 18px;
    transition: 0.6s ease;
    border-radius: 20px;
    user-select: none;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
  
  .prev:hover,
  .next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  /**************************** 
  *       Caption Text
  *****************************/
  .text {
    color: #f2f2f2;
    font-size: 15px;
    padding: 8px 0px;
    position: absolute;
    top: 99%;
    margin-top: -60px;
    width: calc(100vw - 15px);
    text-align: center;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  /**************************** 
  *           dots
  *****************************/
  .dotAll {
    position: absolute;
    width: 100%;
    top: 100%;
    margin-top: -35px;
    z-index: 3;
    text-align: center;
  }
  
  .dot {
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 10px 2px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
  }
  
  .dotActive,
  .dot:hover {
    background-color: #515151;
  }
  
  /**************************** 
  *          Tumbnail
  *****************************/
  
  /* .head */
  
  .thumbnail {
    position: absolute;
    top: 5px;
    left: 2vw;
    margin-top: 8px;
    opacity: 1;
  }
  
  .thumbnail img {
    width: 10%;
    max-width: 200px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
  }
  
  .thumbnailsActive {
    opacity: 0.3;
    box-shadow: inset 0 0 1em gold, 0 0 1em black;
  }
  
  /**************************** 
  *          Other ...
  *****************************/
  
  /* On smaller screens, decrease text size */
  @media only screen and (max-width: 300px) {
    .prev,
    .next,
    .text {
      font-size: 11px;
    }
  }
  
  </style>

  <body>
  <div id="slider" class="slider">
    <div class="wrapper">
      <!-- Slide -->
      <div id="items" class="items">
      ${htmlImg}
      </div>

      <!-- Previous, Next -->
      <a id="prev" class="control prev">&nbsp;&nbsp;&#10094;</a>
      <a id="next" class="control next">&#10095;&nbsp;&nbsp;</a>

      <!-- dot -->
      <div class="dotAll">
      ${htmldot}
      </div>

      <!-- thumbnail -->
      <div class="head">
        <div class="thumbnail">
        ${htmlthumbnail}
        </div>
      </div>
    </div>
  </div>
 
    <script>

    let time = ${time};
    let zoompanOption = ${zoompanActif};
    
    let items = document.getElementById("items");
    let slides = items.getElementsByClassName("slide");
    let imgs = document.querySelectorAll(".myImg");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    let dots = document.getElementsByClassName("dot");
    let thumbnails = document.getElementsByClassName("thumbnailImg");
    
    let posX1 = 0;
    let posX2 = 0;
    let posInitial;
    let posFinal;
    let threshold = 100;
    let slidesLength = slides.length;
    let slideSize = items.getElementsByClassName("slide")[0].offsetWidth;
    let index = 0;
    let allowShift = true;
    let dragOn = false;
    
    let oldIndex = index;
    
    // Init
    if (dots.length > 0) {
      dots[0].classList.add("dotActive");
    }
    if (thumbnails.length > 0) {
      thumbnails[0].classList.add("thumbnailsActive");
    }
    
    if (!zoompanOption) {
      // Mouse and Touch events
      items.onmousedown = dragStart;
    
      // Touch events
      items.addEventListener("touchstart", dragStart);
      items.addEventListener("touchend", dragEnd);
      items.addEventListener("touchmove", dragAction);
      items.addEventListener("mouseout", dragEnd);
    }
    
    // Clone first and last slide
    let firstSlide = slides[0];
    let lastSlide = slides[slidesLength - 1];
    let cloneFirst = firstSlide.cloneNode(true);
    cloneFirst.childNodes[1].setAttribute("id", "-99999");
    let cloneLast = lastSlide.cloneNode(true);
    cloneLast.childNodes[1].setAttribute("id", "-999999");
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    
    // zoom pan
    zoompanInit();
    
    // Events
    imgs.forEach((item, index) => {
      item.addEventListener("dblclick", function () {
        zoompanReset(index);
      });
    });
    
    prev.addEventListener("click", function () {
      shiftSlide(-1);
    });
    
    next.addEventListener("click", function () {
      shiftSlide(1);
    });
    
    // Transition events
    items.addEventListener("transitionend", checkIndex);
    
    // Windows resize
    window.onresize = reportWindowSize;
    
    function reportWindowSize() {
      window.location.reload();
    }
    
    // Automatique
    let auto = setTimeout(slideauto, time);
    
    function slideauto() {
      if (time == 0) {
        clearTimeout(auto);
      } else {
        shiftSlide(1);
        auto = setTimeout(slideauto, time);
      }
    }
    
    // Drag
    function dragStart(e) {
      e = e || window.event;
      e.preventDefault();
      posInitial = items.offsetLeft;
      dragOn = true;
      if (e.type == "touchstart") {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
    
      clearTimeout(auto);
    }
    
    function dragAction(e) {
      e = e || window.event;
    
      if (e.type == "touchmove") {
        posX2 = posX1 - e.touches[0].clientX;
        posX1 = e.touches[0].clientX;
      } else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
      }
      items.style.left = items.offsetLeft - posX2 + "px";
    
      clearTimeout(auto);
    }
    
    function dragEnd(e) {
      if (dragOn == true) {
        posFinal = items.offsetLeft;
        if (posFinal - posInitial < -threshold) {
          shiftSlide(1, "drag");
        } else if (posFinal - posInitial > threshold) {
          shiftSlide(-1, "drag");
        } else {
          items.style.left = posInitial + "px";
        }
      }
      document.onmouseup = null;
      document.onmousemove = null;
      dragOn = false;
    }
    
    // Show
    function showSlides(n) {
      let dif = n - index;
      if (dif != 0) shiftSlide(dif);
    }
    
    // Shift
    function shiftSlide(dir, action) {
      items.classList.add("shifting");
    
      clearTimeout(auto);
    
      oldIndex = index;
    
      if (allowShift) {
        if (!action) {
          posInitial = items.offsetLeft;
        }
        if (dir > 0) {
          items.style.left = posInitial - slideSize * dir + "px";
          index += dir;
        } else if (dir < 0) {
          items.style.left = posInitial + slideSize * Math.abs(dir) + "px";
          index += dir;
        }
      }
    
      allowShift = false;
    }
    
    function checkIndex() {
      clearTimeout(auto);
    
      zoompanReset(oldIndex);
    
      items.classList.remove("shifting");
    
      if (index < 0) {
        items.style.left = -(slidesLength * slideSize) + "px";
        index = slidesLength - 1;
      }
    
      if (index >= slidesLength) {
        items.style.left = -(1 * slideSize) + "px";
        index = 0;
      }
    
      if (dots.length > 0) {
        for (let i = 0; i < dots.length; i++) {
          dots[i].classList.remove("dotActive");
        }
        dots[index].classList.add("dotActive");
      }
    
      if (thumbnails.length > 0) {
        for (let i = 0; i < thumbnails.length; i++) {
          thumbnails[i].classList.remove("thumbnailsActive");
        }
        thumbnails[index].classList.add("thumbnailsActive");
      }
      allowShift = true;
    
      auto = setTimeout(slideauto, time);
    }
    
    ////////////////////////////////////////////////
    //                Zoom Pan
    ////////////////////////////////////////////////
    
    // Inclus
    // <script src="https://unpkg.com/@panzoom/panzoom@4.4.1/dist/panzoom.min.js" />
    // Source
    // https://github.com/timmywil/panzoom
    // Doc
    // https://unpkg.com/browse/@panzoom/panzoom@4.4.1/
    // Demo
    // https://timmywil.com/panzoom/demo/
    
    function zoompanInit() {
      if (zoompanOption) {
        time = 0;
    
        imgs.forEach((item, index) => {
          //, contain: "outside" maxScale: 5
          const panzoom = Panzoom(item, {
            maxScale: 20,
            contain: "outside",
          });
          panzoom.zoom(1.201);
          setTimeout(() => panzoom.pan(0, 0));
    
          // 'object-fit: fill;'
          //'object-fit: cover; cursor: move; user-select: none; touch-action: none; transform-origin: 50% 50%;'
          item.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);
        });
      }
    }
    
    function zoompanReset(index) {
      if (zoompanOption) {
        
        const elem = imgs[index];
        elem.style = null;
        //cssText:'object-fit: cover; cursor: move; user-select: none; touch-action: none;
        //transform-origin: 50% 50%; transition: none 0s ease 0s; transform: scale(0.182684) translate(345.474px, -100.151px);'
    
        //const panzoom = Panzoom(elem, { maxScale: 20, contain: "outside" });
        //panzoom.reset();
        //panzoom.pan(0, 0);
        //panzoom.zoom(1, { animate: true });
      }
    }
    
    </script>
  </body>
</html>`;

  let enc = encodeURIComponent(ht);
  let uri = `data:text/html;charset=utf-8,${enc}`;
  return uri;
};
