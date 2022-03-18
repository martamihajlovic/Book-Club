import { Book } from "./Book.js";

export class Author {
    constructor(id, firstName, lastName, cont) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.books = [];
        this.container = cont;
    }

    /* ****************************
            LOAD AUTHOR
    ****************************** */
    async loadAuthor() {
        const cont = document.createElement("div");
        cont.className = "authorCont";

        await this.loadAuthorInfo(cont);
        this.container.appendChild(cont);
    }

    async loadAuthorInfo(cont) {
        var authorInfo = document.createElement("div");
        authorInfo.className = "bookInfo";

        let name = document.createElement("h2");
        name.innerHTML = this.firstName + " " + this.lastName;
        authorInfo.appendChild(name);
        await this.loadShowBooksBtn(authorInfo);
        cont.appendChild(authorInfo);
    }


    /* ****************************
        BOOKS BY AUTHOR CONTROLS
    ****************************** */
    async loadShowBooksBtn(cont) {
        var btn = document.createElement("button");
        btn.innerHTML = "Show all books";
        btn.id = "showBooks";

        var clicked = false;

        var bookcont = document.createElement("div");
        var temp = document.createElement("div"); 
        temp = await this.loadBooks(bookcont);

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

    async loadBooks(cont) {
        var bookcont = document.createElement("div");
        var books = await this.getBooksByAuthor(this.id, cont);
        books.forEach(b => {
            const c = document.createElement("div");
            b.loadBook(bookcont);
        })
        return bookcont;
    }

    async getBooksByAuthor(id, cont) {
        const res = await fetch(`https://localhost:5001/Author/GetBooksByAuthor/${id}`, {
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