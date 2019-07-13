//---DECLARE GLOBAL VARIABLES---
let i = 0;
let answer = 0;
let winCount = 0;
let lossCount = 0;
let questionSet = [];
let timeRemaining = 30;
let apiQueryCatNum = 0;
let ajaxResponse = [];
let unshuffled = [];
let shuffled = [];

const maxTime = 30;
const questionCount = 10;
const endMsgPerfect ="Perfect score! Your score was:";
const endMsgPass ="Well done! Your score was:";
const endMsgFail ="Oops! Your score was:";


//===LAUNCH GAME===

$(document).ready(function() {
    enableSfx()
    enableBgm()
    $("#btn_start").click(gameLaunch)
    // $("#btn_restart").click(restartGame)
})

function gameLaunch() {
    hideId("#startScreenWrapper")
    showId("#selectionScreenWrapper")
    bounceIn()
    $("#selectionList > li").click(function() {
        apiQueryCatNum = this.value;
        queryAPI();
        bounceOut();
        setTimeout(mainGame, 700);
        setTimeout(swoopIn, 700);
        return apiQueryCatNum;
    })// end click listener
    
}// end gameLaunch()



//API query

function queryAPI() {

    let queryURL = `https://opentdb.com/api.php?amount=${questionCount}&category=${apiQueryCatNum}&difficulty=easy&type=multiple`

    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    ajaxResponse.push(response)
    return ajaxResponse;
    });
    }


//=== LAUNCH GAME ===
function mainGame() {

    hideId("#selectionScreenWrapper")
    showId("#qScreenWrapper")
    showId("#footer")
    showId("#counterWrapper")

    populateQuizCard()
    updateProgressBar()

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
        if ( this.textContent == ajaxResponse[0].results[i].correct_answer ) {
            winCount++
            clearInterval(startTimer)
            setTimeout(timeRemaining = maxTime+1, 1000)
        } else {
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
    cardAnimation()
    setTimeout(populateQuizCard, 800)
}

function populateQuizCard() {
    if (i < ajaxResponse[0].results.length) {
        shuffleQuestions();
        $("#question").text(`${ajaxResponse[0].results[i].question}`)
        $("#option0").text(shuffled[0])
        $("#option1").text(shuffled[1])
        $("#option2").text(shuffled[2])
        $("#option3").text(shuffled[3])
        $("#qCategoryTag").text(ajaxResponse[0].results[i].category)
    }//end if
    else {
        gameOver()
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
    else {clearInterval(timeRemaining)
        $("#counter").css("color", "#555");
    }
    if (timeRemaining < 10) {
        $("#counter").css("color", "#ff5a36");
    }
    $("#counter").text(timeRemaining);
}

function gameOver() {
    hideId("#qScreenWrapper")
    hideId("#counterWrapper")
    showId("#endScreenWrapper")
    if (winCount/ajaxResponse[0].results.length == 1) {
        $("#endMessage").text(endMsgPerfect)         
    }
    else if (winCount/ajaxResponse[0].results.length > .7) {
        $("#endMessage").text(endMsgPass) 
    }
    else {
        $("#endMessage").text(endMsgFail)         
    }
    $("#endScore").text(`${winCount}/${ajaxResponse[0].results.length}`)      
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
};

function bounceOut() {
    $("#selectionCard").addClass("bounceOut").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", 
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
let bgmPlaying = false;
    $("#bgmToggle").click(function() {
        if (!bgmPlaying) {
            bgmPlaying = true;
            $("#bgm")[0].play()
        } else {
            bgmPlaying = false;
            $("#bgm")[0].pause()            
        }
});
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
