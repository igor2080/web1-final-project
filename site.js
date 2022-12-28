let styles;
setInterval(() => {
    $.ajax({
        type: "get",
        dataType: 'jsonp',
        cache: false,
        url: `https://api.allorigins.win/get?url=${encodeURIComponent('https://pastebin.com/raw/ZSHipABD')}`,
        success: function (data) {
            document.querySelector('body').style.background = JSON.parse(data.contents)['background'];
        }
    });
}, 5000);

document.getElementById("userFormSubmit").addEventListener("click", submitForm);

$(document).ready(function () {
    updateGuestbook();
    $("#pageTitle, #drag").draggable();
});

function updateGuestbook() {
    let guestbook = document.getElementById("guestbook");
    guestbook.innerHTML = "";

    let posts = [];

    if (localStorage.getItem('posts') && localStorage.getItem('posts').length > 2) {
        let heading = document.createElement('h2');
        heading.innerHTML = "What others have posted";
        heading.id = "postsHeading";
        guestbook.append(heading);
        posts = JSON.parse(localStorage.getItem('posts'));

        let i = 0;

        for (let post of posts) {
            let container = document.createElement("div");
            container.classList.add('bookItem');

            let imageContainer = document.createElement("div");
            imageContainer.classList.add('imageDiv');
            let imageItem = document.createElement("img");

            imageItem.src = `https://loremflickr.com/160/120?lock=${emailToNumber(post.email)}`;
            imageContainer.append(imageItem);

            let userInputContainer = document.createElement("div");
            userInputContainer.classList.add('userDiv');
            let userDetailsContainer = document.createElement("div");
            let userTextContainer = document.createElement("p");

            let userNameContainer = document.createElement("div");
            let userName = document.createElement("a");
            userName.classList.add('userName');
            userName.href = "mailto:" + post.email;
            userName.innerHTML = post.name;
            let userDate = document.createElement("span");
            userDate.classList.add('userDate');
            userDate.innerHTML = " wrote at " + unixDateToString(post.timestamp);

            userNameContainer.append(userName, userDate);

            userDetailsContainer.append(userNameContainer);

            userTextContainer.innerHTML = post.text;

            userInputContainer.append(userDetailsContainer, userTextContainer);

            let removeButton = document.createElement("a")
            removeButton.href = "javascript:removePost(" + i + ")";
            removeButton.innerHTML = "X";
            removeButton.classList.add("removeButton");

            container.append(imageContainer, userInputContainer, removeButton);

            //structure:
            //container
            //  imageContainer
            //      imageItem
            //  userInputContainer
            //      userDetailsContainer
            //          userNameContainer
            //              userName
            //              userDate
            //      userTextContainer  
            //removeButton      
            guestbook.append(container);
            i++;
        }
    }
}

function submitForm(event) {
    if ($("#doSubmit")[0].checked) {
        //do nothing, form gets submitted elsewhere
    }
    else {
        event.preventDefault();

        let form = document.getElementById("userPostForm");

        if ($(form).valid()) {
            let post = new Post(form.elements['userName'].value, form.elements['userEmail'].value, form.elements['userText'].value);
            addPost(post);
            updateGuestbook();
            this.form.reset();
        }
    }
}

function addPost(post) {
    let posts = [];

    if (localStorage.getItem('posts'))
        posts = JSON.parse(localStorage.getItem('posts'));

    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
}

function removePost(num) {
    if (localStorage.getItem('posts')) {
        let posts = JSON.parse(localStorage.getItem('posts'));

        posts.splice(num, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        updateGuestbook();
    }
}

function generatePosts() {
    let postCount = document.getElementById("postGeneratorCount").value;
    if (postCount > 0) {
        for (let i = 0; i < postCount; i++) {
            let post = new Post("Anonymous",
                Math.trunc(Math.random() * 100000) + "@random.com",
                sentences[randomInt(0, sentences.length)]);
            addPost(post);
        }
        updateGuestbook();
    }
}

class Post {
    constructor(name, email, text) {
        this.name = name;
        this.email = email;
        this.text = text;
        this.timestamp = Date.now();
    }
}

function emailToNumber(email) {//number generator based on email
    let number = 0;

    [...email].forEach(letter => {
        number += letter.charCodeAt(0) * email.length;
    });

    return number;
}

function unixDateToString(unix) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date(unix);
    let formattedString = `${date.getDay() + 1} ${months[date.getMonth()]} ${date.getFullYear()} on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    return formattedString;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}