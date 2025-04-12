const testName = document.querySelector("#test-name");
const numberOfQuestions = document.querySelector("#number-of-questions");
const testTimeHour = document.querySelector("#test-time-hour");
const testTimeMinute = document.querySelector("#test-time-minute");
const startTestButton = document.querySelector("#start-test");

const testNameError = document.querySelector("#test-name ~ span.message");
const numberOfQuestionsError = document.querySelector("#number-of-questions ~ span.message");
const testTimeError = document.querySelector("#test-time-hour ~ span.message");

let sentences = localStorage.getItem("sentences") !== null ? JSON.parse(localStorage.getItem("sentences")) : [];
let testsData = localStorage.getItem("tests") !== null ? JSON.parse(localStorage.getItem("tests")) : {};
let currentTest = localStorage.getItem("currentTest") !== null ? JSON.parse(localStorage.getItem("currentTest")) : null;

let conuter = localStorage.getItem("couner") !== null ? JSON.parse(localStorage.getItem("tests")) : 0;
let testID = conuter;

// function
function genRandomNum() {
    return Math.ceil(Math.random() * 1000)
}
function genTestName() {
    return `Test${Math.floor(Math.random() * 1000)}`;
}
function getQuestion(number) {
    return sentences.filter((sentnece, index) => {
        return index < number;
    })
}
function createTest(Questions = [], testID = 0) {
    let counter = localStorage.getItem("curentQuestion") !== null ? JSON.parse(localStorage.getItem("curentQuestion")) : -1;
    let currentQuestion = {};
    let answersInfo = localStorage.getItem("answersInfo") !== null ? JSON.parse(localStorage.getItem("answersInfo")) : {};
    let questions = {};
    questions[testID] = Questions;
    let testInfo = localStorage.getItem("tests") !== null ? JSON.parse(localStorage.getItem("tests")) : {};
    // testInfo = testInfo.hasOwnProperty(testID) ? testInfo[testID] : {
    //     name: '',
    //     numberOfQuestions: '',
    //     time: {
    //         hour: 0,
    //         minute: 0
    //     },
    //     isFinished: false
    // };


    if (localStorage.getItem("questions") === null) {
        // JSON.parse(localStorage.getItem("questions"));
        localStorage.setItem("questions", JSON.stringify(questions));
    }
    else if (JSON.parse(localStorage.getItem("questions")).hasOwnProperty(testID)) {
        questions = JSON.parse(localStorage.getItem("questions"));
    }
    else {
        questions = JSON.parse(localStorage.getItem("questions"));
        questions[testID] = Questions;
        localStorage.setItem("questions", JSON.stringify(questions));
    }
    // console.log(questions);
    // questions[testID] = questions.hasOwnProperty(testID) ? questions[testID] : { testID: Questions };
    // console.log(questions);


    // questions = questions[testID];

    // console.log(questions);
    function viewQuestion() {
        function view() {
            console.log(counter)
            document.querySelector(".card .card-text p").innerHTML = currentQuestion.translation;
            document.querySelector(".card-translation").innerHTML = '';
            document.querySelector(".user-answer p").innerHTML = '';
            document.querySelector(".question-text  h2 span").innerHTML = `(${questions[testID].length}/${counter + 1})`;
            localStorage.setItem("curentQuestion", JSON.stringify(conuter));

        }
        function next() {

            if (questions[testID][counter + 1]) {
                currentQuestion = questions[testID][++counter];
                view();
                return true;
            }

            return false;
        }
        function previous() {
            if (questions[testID][counter - 1]) {
                currentQuestion = questions[testID][--counter];
                view();
                return true;
            }

            return false;
        }
        return { next, previous }
    }
    function isFinished() {
        return questions[testID][counter + 1] === undefined;
    }
    function check(answer = "") {
        return Number(answer === currentQuestion.sentence) * 100;
    }
    function recordAnswer(answer = "") {
        let answerInfo = {
            answer: answer,
            question: currentQuestion.translation,
            soluation: currentQuestion.sentence,
            score: check(answer)
        }
        document.querySelector(".card-translation").innerHTML = `<span class="dot"></span><p>Soluation: ${answerInfo.soluation}</p>`;
        document.querySelector(".user-answer p").innerHTML = `Your answer: <span id="answer">${answerInfo.answer}</span> <br/>Score: <span id="match">${answerInfo.score}%</span>`;

        answersInfo[testID].push(answerInfo);
        localStorage.setItem("answersInfo", JSON.stringify(answersInfo));
    }
    function endTest() {
        testInfo[testID].isFinished = true;
        localStorage.setItem("tests", JSON.stringify(testInfo));
        localStorage.setItem("currentTest", JSON.stringify(null));
        localStorage.setItem("counter", JSON.stringify(-1));
        localStorage.setItem("curentQuestion", JSON.stringify(-1));
        // localStorage.setItem("questions", JSON.stringify({}));

        document.querySelector(".test").style.display = 'none';
        document.querySelector("main .container .finished_test").style.display = 'flex';
        document.querySelector("main .container .finished_test ").innerHTML = `
        <p id="total-score">Total score: ${answersInfo[testID].reduce((prev, curr) => {
            return prev + curr.score;
        }, 0) / answersInfo[testID].length}%</p>`;
        // localStorage.setItem("answersInfo", JSON.stringify(answersInfo));
        // localStorage.setItem("questions", JSON.stringify(questions));
        // localStorage.setItem("curentQuestion", JSON.stringify(-1));
        // clearInterval(time);
        alert("Test is finished!");
    }
    return {
        viewQuestion, recordAnswer, isFinished, ...(testInfo.hasOwnProperty(testID) ? testInfo[testID] : {
            name: '',
            numberOfQuestions: '',
            time: {
                hour: 0,
                minute: 0
            },
            isFinished: false
        })
        , endTest
    };
}
function startTest(id) {
    document.querySelector(".set-test").style.display = 'none';
    document.querySelector(".test").style.display = 'flex';
    // console.log(id);
    let test = createTest(getQuestion(2), id);
    console.log(test);
    test.viewQuestion().next();
    let answerBox = document.getElementById("answer-box");
    const answerBoxError = document.querySelector("#answer-box ~ span.message");
    let btnMode = 'check';
    document.getElementById("check").addEventListener("click", (e) => {

        if (btnMode === 'check') {

            let answerBoxErrors = validateFormData(answerBox.value, {
                isRequired: true,
                minLength: 1,
                maxLength: 50,
            });
            console.log(answerBoxErrors)
            if (answerBoxErrors.length > 0) {
                answerBoxError.innerHTML = answerBoxErrors[0];
                answerBoxError.classList.add("text-danger");
                answerBox.classList.add("invalid");
                return false;
            } else {
                answerBoxError.innerHTML = "";
                answerBoxError.classList.remove("text-danger");
                answerBox.classList.remove("invalid");
            }

            // no error
            test.recordAnswer(answerBox.value.trim());
            answerBox.setAttribute('disabled', '');
            if (test.isFinished()) {
                e.target.innerHTML = 'Finish';
                btnMode = 'Finish';
            } else {
                e.target.innerHTML = 'Next';
                btnMode = 'goNext';
            }
            answerBox.value = '';

        } else if (btnMode === 'goNext') {
            test.viewQuestion().next();
            e.target.innerHTML = 'CHECK';
            btnMode = 'check';
            answerBox.removeAttribute('disabled');
            console.log(answerBox.value.trim())
        }
        else if (btnMode === 'Finish') {
            test.endTest();
        }



    });



    // test time
    let hour = test.time.hour;
    let minute = test.time.minute;
    document.querySelector(".sub .time span").innerHTML = `<span>${hour}:${minute} </span>`;

    const time = setInterval(() => {
        console.log(time);

        if (minute > 0) {
            minute--;
        } else if (hour > 0) {
            hour--;
            minute = 59;
        }
        else {
            clearInterval(time);
            alert("Time is up!");
            test.endTest();
        }
        document.querySelector(".sub .time span").innerHTML = `<span>${hour}:${minute} </span>`;
    }, 1000 * 60);
}
// StartTest();
testName.value = genTestName();
numberOfQuestions.value = sentences.length;
testTimeHour.value = 0;
testTimeMinute.value = 10;

startTestButton.addEventListener("click", () => {

    let testNameErrors = validateFormData(testName.value, {
        isRequired: true,
        minLength: 5,
        maxLength: 50,
    });
    let numberOfQuestionsErrors = validateFormData(numberOfQuestions.value, {
        isRequired: true,
        isNumber: true,
        minValue: 1,
        maxValue: 100,
    });
    let testTimeHourErrors = validateFormData(testTimeHour.value, {
        isRequired: true,
        isNumber: true,
        minValue: 0,
        maxValue: 23,
    });
    let testTimeMinuteErrors = validateFormData(testTimeMinute.value, {
        isRequired: true,
        isNumber: true,
        minValue: 0,
        maxValue: 59,
    });

    // Validate test name
    if (testNameErrors.length > 0) {
        testNameError.innerHTML = testNameErrors[0];
        testNameError.classList.add("text-danger");
        testName.classList.add("invalid");
        return false;
    } else {
        testNameError.innerHTML = "";
        testNameError.classList.remove("text-danger");
        testName.classList.remove("invalid");
    }

    // Validate number of questions
    if (numberOfQuestionsErrors.length > 0) {
        numberOfQuestionsError.innerHTML = numberOfQuestionsErrors[0];
        numberOfQuestionsError.classList.add("text-danger");
        numberOfQuestions.classList.add("invalid");
        return false;
    } else if (numberOfQuestions.value > sentences.length) {
        numberOfQuestionsError.innerHTML = `Number of questions cannot be more than ${sentences.length} (number of sentence you have).`;
        numberOfQuestionsError.classList.add("text-danger");
        numberOfQuestions.classList.add("invalid");
        return false;
    }
    else {
        numberOfQuestionsError.innerHTML = "";
        numberOfQuestionsError.classList.remove("text-danger");
        numberOfQuestions.classList.remove("invalid");
    }

    // Validate test time hour
    if (testTimeHourErrors.length > 0) {
        testTimeError.innerHTML = testTimeHourErrors[0];
        testTimeError.classList.add("text-danger");
        testTimeHour.classList.add("invalid");
        return false;
    } else {
        testTimeError.innerHTML = "";
        testTimeError.classList.remove("text-danger");
        testTimeHour.classList.remove("invalid");
    }
    if (testTimeMinuteErrors.length > 0) {
        testTimeError.innerHTML = testTimeMinuteErrors[0];
        testTimeError.classList.add("text-danger");
        testTimeMinute.classList.add("invalid");
        return false;
    } else {
        testTimeError.innerHTML = "";
        testTimeError.classList.remove("text-danger");
        testTimeMinute.classList.remove("invalid");
    }
    if (testTimeHour.value.trim() === "0" && testTimeMinute.value.trim() === "0") {
        testTimeError.innerHTML = "Test time cannot be 0 hours and 0 minutes.";
        testTimeError.classList.add("text-danger");
        testTimeHour.classList.add("invalid");
        testTimeMinute.classList.add("invalid");
        return false;
    }
    else {
        testTimeError.innerHTML = "";
        testTimeError.classList.remove("text-danger");
        testTimeHour.classList.remove("invalid");
        testTimeMinute.classList.remove("invalid");
    }

    // If there are no errors, start the test
    testsData[testID] = {
        name: testName.value.trim(),
        numberOfQuestions: numberOfQuestions.value.trim(),
        time: {
            hour: testTimeHour.value.trim(),
            minute: testTimeMinute.value.trim()
        },
        isFinished: false
    };
    currentTest = testID++;
    localStorage.setItem("tests", JSON.stringify(testsData));
    localStorage.setItem("currentTest", JSON.stringify(currentTest));
    localStorage.setItem("counter", JSON.stringify(conuter++));

    console.log("Test Data:", testsData);

    startTest(currentTest);
});


// resume the test
if (currentTest !== null) {
    startTest(currentTest);
}
