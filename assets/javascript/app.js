//---DECLARE GLOBAL VARIABLES---
let i = 0;
let answer = 0;
let winCount = 0;
let lossCount = 0;
let questionSet = [];
let timeRemaining = 30;
const maxTime = 30;

const qSet0 = [{
    question: "#1 Which of these are true?",
    options: ["This one", "Not this one", "Not this one either"],
    answer: 0
    },{
    question: "#2 What is the right answer here?",
    options: ["Not the right answer", "This is", "Nope"],
    answer: 1
    },{
    question: "#3 What is the capital of the UK?",
    options: ["Reading", "Edinburgh", "London"],
    answer: 2 
    }];

// const qSet1 = [];
// const qSet2 = [];


// USE ONE Q-SET FOR NOW
questionSet = qSet0

//===LAUNCH GAME===

$(document).ready(function() {
    $("#btn_start").click(gameLaunch)
    $("#btn_select").click(mainGame)
    // $("#btn_restart").click(restartGame)
})

function gameLaunch() {
    hideId("#startScreenWrapper")
    showId("#selectionScreenWrapper")
}

//=== LAUNCH GAME ===
function mainGame() {

    hideId("#selectionScreenWrapper")
    showId("#qScreenWrapper")
    showId("#counterWrapper")

    populateQuizCard()
    updateProgressBar()
    swoopIn()
    startTimer()
    getAnswer()

}//end mainGame()

// function restartGame() {
//     i = 0
//     answer = 0
//     winCount = 0
//     lossCount = 0
//     hideId("#endScreenWrapper")
//     showId("#selectionScreenWrapper")
// }

//=== MAIN FUNCTIONS ===

function getAnswer() {

    $("#optionList > li").click(function() {
        if ( this.value == questionSet[i].answer ) {
            answer = true
            winCount++
            clearInterval(startTimer)
            setTimeout(timeRemaining = maxTime+1, 1000)
        } else {
            answer = false
            lossCount++
            clearInterval(startTimer)
            setTimeout(timeRemaining = maxTime+1, 1000)
            timeRemaining = maxTime;
        }
        nextCard()
    })// end click listener

}

function nextCard() {
    i++
    updateProgressBar()
    clickFreeze()
    setTimeout(clickUnfreeze,1000)
    swoopOut()      
    hideId("#qCard")
    setTimeout(populateQuizCard, 900)
    setTimeout(swoopIn, 1000)
}

function populateQuizCard() {
    if (i < questionSet.length) {
    $("#question").text(questionSet[i].question)
    $("#option0").text(questionSet[i].options[0])
    $("#option1").text(questionSet[i].options[1])
    $("#option2").text(questionSet[i].options[2])
    }//end if
    else {
        gameOver()
    }//end else
}

function updateProgressBar() {
    $("#progressBar").css({"width": (i/questionSet.length)*100 +"%"});
    $("#progressPrompt").html(`${questionSet.length-i} out of ${questionSet.length} questions remaining`)

}

function startTimer() {
    setInterval(countDown,1000);
}

function countDown() {
    if (timeRemaining > 0) {
        timeRemaining--;
    }
    else {clearInterval(timeRemaining)
        $("#counter").css("color", "#333");
    }
    if (timeRemaining < 10) {
        $("#counter").css("color", "#B00020");
    }
    $("#counter").text(timeRemaining);
}

function gameOver() {
    hideId("#qScreenWrapper")
    hideId("#counterWrapper")
    showId("#endScreenWrapper")
    if (winCount/questionSet.length == 1) {
        $("#endMessage").text("Quiz champ! Your score was:")         
    }
    else if (winCount/questionSet.length > .7) {
        $("#endMessage").text("Well done! Your score was:") 
    }
    else {
        $("#endMessage").text("Uh oh! Your score was:")         
    }
    $("#endScore").text(`${winCount}/${questionSet.length}`)      
}


//---SHOW/HIDE FUNCTIONS---
function showId(selector) {
    $(selector).show()
};
function hideId(selector) {
    $(selector).hide()
};

//---RESET VARIABLE
function resetVar() {
    selector = 0;
};

//---ANIMATION FUNCTIONS---
function swoopIn() {
    $("#qCard").addClass("bounceInLeft").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", 
    function() {
        $(this).removeClass("bounceInLeft")
    })
};

function swoopOut() {
    $("#qCard").addClass("bounceOutRight").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", 
    function() {
        $(this).removeClass("bounceOutRight")
    })
};

//---FREEZE CLICK FUNCTIONS---
function clickFreeze() {
    $(".clickable").css("pointer-events", "none");
}

function clickUnfreeze() {
    $(".clickable").css("pointer-events", "auto");
}