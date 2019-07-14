//---DECLARE GLOBAL VARIABLES---
let i = 0;
let answer = 0;
let winCount = 0;
let lossCount = 0;
let questionSet = [];
let timeRemaining = 0;
let levelDifficulty = [];
let apiQueryCatNum = 0;
let ajaxResponse = [];
let unshuffled = [];
let shuffled = [];

const maxTime = 15;
const questionCount = 10;
const endMsgPerfect ="Perfect score! Your score was:";
const endMsgPass ="Well done! Your score was:";
const endMsgFail ="Oops! Your score was:";


//===LAUNCH APP===

$(document).ready(function() {
    enableSfx()
    enableBgm()
    //Difficulty input triggers category selection screen
    $("#startList > li").click(function() {
        levelDifficulty = this.id;
        selectionLaunch();
    });//end click listener
})

function selectionLaunch() {
    hideId("#startScreenWrapper")
    showId("#selectionScreenWrapper")
    bounceIn()
    //Selection input triggers question screen
    $("#selectionList > li").click(function() {
        apiQueryCatNum = this.value;
        queryAPI();
        bounceOut();
        setTimeout(mainApp, 700);
        setTimeout(swoopIn, 700);
        clearInterval(startTimer);
        return apiQueryCatNum;
    })// end click listener
    
}// end selectionLaunch()


//API query

function queryAPI() {

    let queryURL = `https://opentdb.com/api.php?amount=${questionCount}&category=${apiQueryCatNum}&difficulty=${levelDifficulty}&type=multiple`;

    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    ajaxResponse.push(response)
    return ajaxResponse;
    });
    }


//=== LAUNCH MAIN APP ===
function mainApp() {

    hideId("#selectionScreenWrapper")
    showId("#qScreenWrapper")
    showId("#footer")
    showId("#counterWrapper")
    populateQuizCard()
    updateProgressBar()
    startTimer()
    getAnswer()
}//end mainApp()


//=== MAIN FUNCTIONS ===

function getAnswer() {
    $("#optionList > li").click(function() {
        if ( this.textContent == ajaxResponse[0].results[i].correct_answer ) {
            winCount++;
            revealCorrect();
            sfxWinSound();
            appendScoreSummaryWin();
            clearInterval(startTimer);
            setTimeout(timeRemaining = maxTime+1, 1500);
        } else {
            lossCount++;
            revealIncorrect();
            sfxLoseSound();
            appendScoreSummaryLose();
            clearInterval(startTimer);
            setTimeout(timeRemaining = maxTime+1, 1500);
        }
        nextCard();
    })// end click listener
}

function nextCard() {
    i++;
    updateProgressBar();
    clickFreeze();
    setTimeout(clickUnfreeze,1000);
    cardAnimation();
    setTimeout(populateQuizCard, 800);
}

function populateQuizCard() {
    if (i < ajaxResponse[0].results.length) {
        shuffleQuestions();
        $("#question").html(`${ajaxResponse[0].results[i].question}`);
        $("#option0").html(shuffled[0]);
        $("#option1").html(shuffled[1]);
        $("#option2").html(shuffled[2]);
        $("#option3").html(shuffled[3]);
        $("#qCategoryTag").html(ajaxResponse[0].results[i].category);
        $("#counter").css("color", "#555");
        timeRemaining = maxTime;
    }//end if
    else {
        appEnd();
    }//end else
}

//Trivia API has correct answer and 3 incorrect answers stored separately, insert correct answer at random li-position in ul
function shuffleQuestions() {

    unshuffled = [
    ajaxResponse[0].results[i].correct_answer,
    ajaxResponse[0].results[i].incorrect_answers[0],
    ajaxResponse[0].results[i].incorrect_answers[1],
    ajaxResponse[0].results[i].incorrect_answers[2]];

    shuffled = unshuffled
    .map((a) => ({sort: Math.random(), value:a}))
    .sort((a,b) => a.sort - b.sort)
    .map((a) => a.value)

    return shuffled;
}

function updateProgressBar() {
    $("#progressBar").css({"width": (i/ajaxResponse[0].results.length)*100 +"%"});
    $("#progressPrompt").html(`${ajaxResponse[0].results.length-i} out of ${ajaxResponse[0].results.length} questions remaining`)
}

function startTimer() {
    setInterval(countDown,1000);
}

function countDown() {
    if (timeRemaining > 0) {
        timeRemaining--;
    }
    else {
        if (i < ajaxResponse[0].results.length) {
        clearInterval(timeRemaining)
        lossCount++;
        revealIncorrect();
        sfxLoseSound();
        appendScoreSummaryLose();
        clearInterval(startTimer);
        setTimeout(timeRemaining = maxTime, 1000);        
        nextCard();
        $("#counter").css("color", "#555");
        }
    }
    if (timeRemaining < 5) {
        $("#counter").css("color", "#ff5a36");
    }
    $("#counter").text(timeRemaining);
}

function appEnd() {
    hideId("#qScreenWrapper")
    hideId("#counterWrapper")
    hideId("#progressBarWrapper")
    showId("#endScreenWrapper")
    if (winCount/ajaxResponse[0].results.length == 1) {
        $("#endMessage").text(endMsgPerfect)         
    }
    else if (winCount/ajaxResponse[0].results.length > .6) {
        $("#endMessage").text(endMsgPass) 
    }
    else {
        $("#endMessage").text(endMsgFail)         
    }
    sfxEndSound();
    $("#endScore").text(`${winCount}/${ajaxResponse[0].results.length}`)      
}


//---MISC FUNCTIONS---

function appendScoreSummaryWin() {
    $("#scoreSummaryWrapper").append(`<div id="scoreSummaryCard" style="background-color: #5CF378"><a><i class="fas fa-check" id="scoreSummaryIcon"></i></a></div>`)
}

function appendScoreSummaryLose() {
    $("#scoreSummaryWrapper").append(`<div id="scoreSummaryCard" style="background-color: #F37A64"><a><i class="fas fa-times" id="scoreSummaryIcon"></i></a></div>`)
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

//---ANSWER REVEAL
function revealCorrect() {
    showId("#revealAnswerWrapper");
    $("#answerHere").html(`${ajaxResponse[0].results[i].correct_answer} is right!`);
    $("#revealAnswerCard").css("background-color", "#5CF378");
    $("#revealAnswerIcon").addClass("fas fa-check");
    setTimeout(function() {$("#answerHere").html("")}, 800);
    setTimeout(function() {$("#revealAnswerCard").css("background-color", "unset")}, 800);
    setTimeout(function() {$("#revealAnswerIcon").removeClass("fas fa-check")}, 800);
    setTimeout(function() {hideId("#revealAnswerWrapper")}, 800);
};
function revealIncorrect() {
    showId("#revealAnswerWrapper");
    $("#answerHere").html(`${ajaxResponse[0].results[i].correct_answer} was the right answer!`);
    $("#revealAnswerCard").css("background-color", "#F37A64");
    $("#revealAnswerIcon").addClass("fas fa-times");
    setTimeout(function() {$("#answerHere").html("")}, 800);
    setTimeout(function() {$("#revealAnswerCard").css("background-color", "unset")}, 800);
    setTimeout(function() {$("#revealAnswerIcon").addClass("fas fa-times")}, 800);
    setTimeout(function() {hideId("#revealAnswerWrapper")}, 800);
};

//---ANIMATION AND SFX FUNCTIONS---
function cardAnimation() {
    $("#qCard").removeClass("bounceInLeft")
    setTimeout(function() {$("#qCard").addClass("bounceOutRight")}, 0);
    setTimeout(function() {$("#qCard").removeClass("bounceOutRight")}, 700);
    setTimeout(function() {$("#qCard").addClass("bounceInLeft")}, 700);
    setTimeout(function() {$("#qCard").removeClass("bounceInLeft")}, 2000);        
}

function swoopIn() {
    $("#qCard").addClass("bounceInLeft")
};

function swoopOut() {
    $("#qCard").addClass("bounceOutRight")
};

function bounceIn() {
    $("#selectionCard").addClass("bounceIn").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", 
    function() {
        $(this).removeClass("bounceIn")
    })
    $("#startCard").addClass("bounceIn").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", 
    function() {
        $(this).removeClass("bounceIn")
    })
};

function bounceOut() {
    $("#selectionCard").addClass("bounceOut").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", 
    function() {
        $(this).removeClass("bounceOut")
    })
    $("#startCard").addClass("bounceOut").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", 
    function() {
        $(this).removeClass("bounceOut")
    })
};

function enableSfx() {
    $(".btnSound").mouseenter(function() {
        $("#sfxHover")[0].play()});
    $(".btnSound").click(function() {
        $("#sfxClick")[0].play()})
};

function enableBgm() {
    $("#bgm")[0].play()
};

//FUNCTION TO PLAY/PAUSE AUDIO
// function enableBgm() {
// let bgmPlaying = false;
//     $("#bgmToggle").click(function() {
//         if (!bgmPlaying) {
//             bgmPlaying = true;
//             $("#bgm")[0].play()
//         } else {
//             bgmPlaying = false;
//             $("#bgm")[0].pause()            
//         }
// });
// };


function sfxWinSound() {
    $("#sfxWin")[0].play()
};
function sfxLoseSound() {
    $("#sfxLose")[0].play()
};
function sfxEndSound() {
    $("#sfxEnd")[0].play()
};
// var clickSfx = $("#sfx")[1];
// $(".btnHover").click(function() {
//     clickSfx.play()
// })};
// var sweepSfx = $("#sfx")[2];
// $(".btnHover").mouseenter(function() {
//     sweepSfx.play()
// })};

//---FREEZE CLICK FUNCTIONS---
function clickFreeze() {
    $(".clickable").css("pointer-events", "none");
};

function clickUnfreeze() {
    $(".clickable").css("pointer-events", "auto");
};
