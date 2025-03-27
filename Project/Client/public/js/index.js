document.addEventListener("DOMContentLoaded", function () {
    const returnMessage = document.getElementById("returnMessage");

    function returnToMainMenu() {
        window.location.href = "home";
    }

    
    document.addEventListener("keydown", function (event) {
        if (event.key === " ") {
            returnToMainMenu();
        }
    });

   
    returnMessage.addEventListener("click", function () {
        returnToMainMenu();
    });

    let fadingOut = false;
    let fadeInInterval;
    let fadeOutInterval;

    returnMessage.style.opacity = 1; 

    function fadeInAndOut() {
        if (fadingOut) {
            fadingOut = false;
            clearInterval(fadeOutInterval);
            fadeInInterval = setInterval(function () {
                returnMessage.style.opacity = parseFloat(returnMessage.style.opacity) + 0.05;
                if (parseFloat(returnMessage.style.opacity) >= 1) {
                    clearInterval(fadeInInterval);
                    fadingOut = true;
                    fadeOutInterval = setInterval(function () {
                        returnMessage.style.opacity = parseFloat(returnMessage.style.opacity) - 0.05;
                        if (parseFloat(returnMessage.style.opacity) <= 0) {
                            clearInterval(fadeOutInterval);
                            fadeInAndOut(); 
                        }
                    }, 100);
                }
            }, 100);
        } else {
            fadingOut = true;
            clearInterval(fadeInInterval);
            fadeOutInterval = setInterval(function () {
                returnMessage.style.opacity = parseFloat(returnMessage.style.opacity) - 0.05;
                if (parseFloat(returnMessage.style.opacity) <= 0) {
                    clearInterval(fadeOutInterval);
                    fadingOut = false;
                    fadeInInterval = setInterval(function () {
                        returnMessage.style.opacity = parseFloat(returnMessage.style.opacity) + 0.05;
                        if (parseFloat(returnMessage.style.opacity) >= 1) {
                            clearInterval(fadeInInterval);
                            fadeOutInterval = setInterval(function () {
                                returnMessage.style.opacity = parseFloat(returnMessage.style.opacity) - 0.05;
                                if (parseFloat(returnMessage.style.opacity) <= 0) {
                                    clearInterval(fadeOutInterval);
                                    fadeInAndOut(); 
                                }
                            }, 100);
                        }
                    }, 100);
                }
            }, 100);
        }
    }

    fadeInAndOut();
});