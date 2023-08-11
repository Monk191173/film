'use strict';

let sel = selector => document.querySelector(selector);
const first = sel('#first');
let nameRegExp = /^[a-zA-Z 0-9]{1,20}$/;
let curPage = 1;

const submit = sel('#submit');
const prev = sel('#prev');
const next = sel('#next');
prev.setAttribute('disabled', true);
next.setAttribute('disabled', true);
const topBut = sel('#top');

/*-------------------------------------------------------------------film name */
first.addEventListener('focus', () => {
    first.style.outlineColor = 'rgb(159,198,242)';
});

first.addEventListener('input', () => {
    if (nameRegExp.test(first.value)) {
        first.style.outlineColor = 'green'
    }
    else {
        first.style.outlineColor = 'red';
    }
});

topBut.addEventListener('click',()=>{
window.scroll({top:0})
});

next.addEventListener('click', () => {
    curPage++;
    if (curPage > 1) prev.removeAttribute('disabled');
    if (curPage >= 100) {
        curPage = 100;
        next.setAttribute('disabled', true);
        getPage(100);
    }
    else getPage(curPage);
    sel('#curPage').innerHTML = curPage;
});

prev.addEventListener('click', () => {
    curPage--;
    if (curPage < 100) next.removeAttribute('disabled');
    if (curPage <= 1) {
        curPage = 1;
        prev.setAttribute('disabled', true);
        getPage(1);
    }
    else getPage(curPage);
    sel('#curPage').innerHTML = curPage;
});

function createFilm(poster, title, type, year, id) {
    let mainDiv = document.createElement(`div`);
    mainDiv.setAttribute('class', 'short-info');

    let imgDiv = document.createElement(`div`);
    imgDiv.setAttribute('class', 'short-info-img');
    imgDiv.setAttribute('style', `background:url("${poster}") 0% 0% / auto auto no-repeat;`);
    let titleDiv = document.createElement(`div`);
    titleDiv.setAttribute('class', 'short-info-title');
    titleDiv.innerHTML = `${title}`;
    let typeP = document.createElement(`p`);
    typeP.setAttribute('class', 'short-info-type');
    typeP.innerHTML = `${type}`;
    let yearP = document.createElement(`p`);
    yearP.setAttribute('class', 'short-info-year');
    yearP.innerHTML = `${year}`;
    let moreBut = document.createElement(`button`);
    moreBut.setAttribute('class', 'short-info-more');
    moreBut.setAttribute('id', `${id}`);
    moreBut.setAttribute('onClick', 'moreClick(this)');
    moreBut.innerHTML = 'More details...';

    mainDiv.append(imgDiv);
    mainDiv.append(titleDiv);
    mainDiv.append(typeP);
    mainDiv.append(yearP);
    mainDiv.append(moreBut);
    document.getElementsByClassName('result')[0].append(mainDiv);
}

async function getPage(page) {
    let curCursor = sel('.container').style.cursor;
    sel('.container').style.cursor = 'wait';
    let res = sel('.result');
    while (res.firstChild) {
        res.removeChild(res.firstChild);
    }
    sel('.error').innerHTML = '';
    if (first.value == '') sel('.error').innerHTML = 'Please type film title !!!'
    else {
        try {
            await fetch(`http://www.omdbapi.com/?s=${first.value}&page=${page}&apikey=eeb56d4b`)
                .then(resp => resp.json())
                .then(data => {
                    for (let i = 0; i < data.Search.length; i++) {
                        createFilm(data.Search[i].Poster, data.Search[i].Title, data.Search[i].Type, data.Search[i].Year, data.Search[i].imdbID)
                    }
                })
        }
        catch { sel('.error').innerHTML = data.Error; }
    }
    sel('.container').style.cursor = curCursor;
}

submit.addEventListener('click', () => {
    curPage = 1;
    getPage(curPage);
    next.removeAttribute('disabled');
    sel('#curPage').innerHTML = curPage;
});

submit.addEventListener('touchstart', (evn) => {
    evn.preventDefault();
    curPage = 1;
    getPage(curPage);
    next.removeAttribute('disabled');
    sel('#curPage').innerHTML = curPage;
});

sel('#more-submit').addEventListener('click', () => {
    sel('.modal-bg').style.display = 'none';
})

async function moreClick(obj) {
    await fetch(`http://www.omdbapi.com/?i=${obj.id}&plot=full&apikey=eeb56d4b`)
        .then(resp => resp.json())
        .then(data => {
            try {
                sel('.modal-bg').style.display = 'flex';
                sel('.more-win-left').setAttribute('style', `background:url("${data.Poster}") 0% 0% / 100% auto no-repeat;`);
                sel('.more-win-right').children[0].innerText = data.Title;
                sel('.more-win-right').children[1].innerText = data.Rated + ' ' + data.Year + ' ' + data.Genre;
                sel('.more-win-right').children[2].innerText = data.Plot;
                sel('.more-win-right').children[3].innerHTML = '<b>Written by:</b> ' + data.Writer;
                sel('.more-win-right').children[4].innerHTML = '<b>Directed by:</b> ' + data.Director;
                sel('.more-win-right').children[5].innerHTML = '<b>Starring:</b> ' + data.Actors;
                sel('.more-win-right').children[6].innerHTML = '<b>Box Office:</b> ' + data.BoxOffice;
                sel('.more-win-right').children[7].innerHTML = '<b>Awards:</b> ' + data.Awards;
                sel('.more-win-right').children[8].innerHTML = '<b>Ratings:</b> ' +
                    data.Ratings[0].Source + ':' + data.Ratings[0].Value + ', ' +
                    data.Ratings[1].Source + ':' + data.Ratings[1].Value + ', ' +
                    data.Ratings[2].Source + ':' + data.Ratings[2].Value;
            }
            catch { sel('.error').innerHTML = data.Error; }
        })
}


