import { Book } from "./Book.js";

export class Genre {
    constructor(id, name, cont) {
        this.id = id;
        this.name = name;
        this.container = cont;
        this.books = [];
    }

    /* ****************************
            LOAD GENRES
    ****************************** */
    async loadGenre() {
        const cont = document.createElement("div");
        cont.className = "authorCont";

        await this.loadGenreInfo(cont);
        this.container.appendChild(cont);
    }

    /* ****************************
            LOAD GENRE INFO
    ****************************** */
    async loadGenreInfo(cont) {
        var genreInfo = document.createElement("div");
        genreInfo.className = "bookInfo";

        let name = document.createElement("h2");
        name.innerHTML = this.name + " ";
        genreInfo.appendChild(name);
        await this.loadShowBooksBtn(genreInfo);
        cont.appendChild(genreInfo);
    }


    /* ****************************
        LOAD BOOKS FOR GENRES
    ****************************** */
    async loadShowBooksBtn(cont) {
        var btn = document.createElement("button");
        btn.innerHTML = "Show all books";
        btn.id = "showBooks";

        var clicked = false;

        var bookcont = document.createElement("div");
        var temp = document.createElement("div");
        temp = await this.loadGenres(bookcont);

        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (!clicked) {
                cont.appendChild(bookcont);
                btn.innerHTML = "Hide all books";
                clicked = true;
            } else {
                cont.removeChild(bookcont);
                clicked = false;
                btn.innerHTML = "Show all books";
            }
        })
        cont.appendChild(btn);
    }

    async loadGenres(cont) {
        var bookcont = document.createElement("div");
        var books = await this.getBooksByGenre(this.id, cont);
        books.forEach(b => {
            const c = document.createElement("div");
            b.loadBook(bookcont);
        })
        return bookcont;
    }

    async getBooksByGenre(id, cont) {
        const res = await fetch(`https://localhost:5001/BookGenre/GetBooksByGenre/${id}`, {
            method: "GET"
        })
        if (res.ok) {
            const data = await res.json();
            var works = [];
            data.forEach(work => {
                works.push(new Book(work.id, work.title, cont));
            });

            this.books = works;
            return works;
        } else return null;
    }

}