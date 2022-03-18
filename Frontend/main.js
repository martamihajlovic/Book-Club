import { Book } from "./Klase/Book.js";
import { Author } from "./Klase/Author.js";
import { BookCollection } from "./Klase/BookCollection.js";
import { Genre } from "./Klase/Genre.js";


const host = document.body;
var allcollections = [];
var allbooks = [];
var allauthors = [];
var allgenres = [];


/* ****************************
    POSTAVLJANJE DIVOVA ZA SVE
****************************** */
var options = document.createElement("div");
options.id = "options";

var showing = document.createElement("div");
showing.id = "showing";

let contBooks = document.createElement("div");
contBooks.className = "leftCont";

let contAuthors = document.createElement("div");
contAuthors.className = "leftCont";

let contCols = document.createElement("div");
contCols.className = "rightCont";

let contGenres = document.createElement("div");
contGenres.className = "leftCont";


await loadOptions();

async function loadOptions() {
    const btns = [];

    var colsBtn = document.createElement("button");
    colsBtn.innerHTML = "Collections";
    btns.push(colsBtn);

    var booksBtn = document.createElement("button");
    booksBtn.innerHTML = "Books";
    // booksBtn.id = "booksBtn"
    btns.push(booksBtn);

    var authorBtn = document.createElement("button");
    authorBtn.innerHTML = "Authors";
    btns.push(authorBtn);

    var genresBtn = document.createElement("button");
    genresBtn.innerHTML = "Genres";
    btns.push(genresBtn);

    options.appendChild(colsBtn);
    options.appendChild(booksBtn);
    options.appendChild(authorBtn);
    options.appendChild(genresBtn);

    colsBtn.disabled = true;
    contBooks = await loadAllBooks();
    contAuthors = await loadAllAuthors();
    await loadAllCollections();
    contGenres = await loadAllGenres();


    /* *****************************************
        RENDEROVANJE PRIKAZA U ODNOSU NA DUGMICE
    ******************************************** */
    btns.forEach((btn) => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            e.currentTarget.classList.add("active");
            // console.log(e.currentTarget);

            btns.forEach(b => {
                b.disabled = false;
            })
            btn.disabled = true;
            if (btn == booksBtn) {
                allbooks.forEach(b => {
                    contAuthors.remove();
                    contGenres.remove();
                    showing.appendChild(contBooks);
                });
            } else if (btn == authorBtn) {
                allauthors.forEach(a => {
                    contBooks.remove();
                    contGenres.remove();
                    showing.appendChild(contAuthors);
                })
            } else if (btn == colsBtn) {
                contBooks.remove();
                contAuthors.remove();
                contGenres.remove();
                // showing.appendChild(contCols);
            } else if (btn == genresBtn) {
                allgenres.forEach(g => {
                    contBooks.remove();
                    contAuthors.remove();
                    showing.appendChild(contGenres);
                })
            }
        });
    });
}

host.appendChild(options);
showing.appendChild(contCols);
host.appendChild(showing);

var n = new BookCollection(null, null, contCols);
n.loadAddNewCol(host);


/* ****************************
    GETTER/LOADING FUNCTIONS
****************************** */
async function loadAllCollections() {

    fetch("https://localhost:5001/BookCollection/GetCollections")
        .then(p => {
            p.json().then(collections => {
                collections.forEach(col => {
                    var p = new BookCollection(col.id, col.name, contCols);
                    allcollections.push(p)
                    p.loadCollection();
                });
            });
        })
}

async function loadAllBooks() {
    fetch("https://localhost:5001/Book/GetAllBooks")
        .then(p => {
            p.json().then(books => {
                books.forEach(book => {
                    var p = new Book(book.id, book.title, contBooks);
                    allbooks.push(p)
                    p.loadBook();
                });
            });
        })
    return contBooks;
}

async function loadAllAuthors() {
    fetch("https://localhost:5001/Author/GetAuthors")
        .then(p => {
            p.json().then(authors => {
                authors.forEach(author => {
                    var p = new Author(author.id, author.firstName, author.lastName, contAuthors);
                    allauthors.push(p);
                    p.loadAuthor();
                });
            });
        })
    return contAuthors;
}

async function loadAllGenres() {
    fetch("https://localhost:5001/Genre/GetGenres")
        .then(p => {
            p.json().then(genres => {
                genres.forEach(genre => {
                    var p = new Genre(genre.id, genre.name, contGenres);
                    allgenres.push(p);
                    p.loadGenre();
                });
            });
        })
    return contGenres;
}

