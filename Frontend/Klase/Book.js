import { Author } from "./Author.js";
import { Genre } from "./Genre.js";
import { BookCollection } from "./BookCollection.js";


export class Book {
    constructor(id, title, cont) {
        this.id = id;
        this.title = title;
        this.author = null;
        this.genres = [];
        this.container = cont;
        this.bookInfo = null;
    }

    /* ****************************
                LOAD BOOK
    ****************************** */
    async loadBook() {

        const cont = document.createElement("div");
        cont.className = "bookCont";

        await this.loadBookInfo(cont);

        await this.loadAddToCol(cont);

        this.container.appendChild(cont);

    }

    
    /* ****************************
            LOAD BOOK INFO
    ****************************** */
    async loadBookInfo(container) {
        this.bookInfo = document.createElement("div");
        this.bookInfo.className = "bookInfo";

        let bookTitle = document.createElement("h2");
        bookTitle.innerHTML = this.title;
        this.bookInfo.appendChild(bookTitle);

        let authorName = document.createElement("p");
        authorName.innerHTML = await this.getAuthor();
        let l = document.createElement("label");
        l.innerHTML = "Author: "
        // l.appendChild(authorName);
        this.bookInfo.appendChild(l);
        this.bookInfo.appendChild(authorName);

        let bookGenres = document.createElement("i");
        bookGenres.innerHTML = await this.getGenres();
        this.bookInfo.appendChild(bookGenres);

        container.appendChild(this.bookInfo);
    }

    async getAuthor() {
        let res = fetch(`https://localhost:5001/Book/GetAuthorOfBook/${this.id}`, {
            method: "GET"
        })
            .then(data => data.json())
            .then(d => {
                var a = d[0];
                return a.firstName + ' ' + a.lastName;
            });

        return res;
    }

    async getGenres() {
        let res = [];
        res = await fetch(`https://localhost:5001/Genre/GetBookGenres/${this.id}`, {
            method: "GET"
        })
            .then(data => data.json()
                .then(d => {
                    for (var g in d) {
                        res.push(d[g].name);
                    }
                    return res;
                }));
        return res;
    }


    /* ****************************
            COLLECTION CONTROLS
    ****************************** */
    async getCollections() {
        let res = [];
        res = await fetch("https://localhost:5001/BookCollection/GetCollections/", {
            method: "GET"
        })
            .then(data => data.json()
                .then(d => {
                    return d;
                }));
        return res;
    }

    async removeBookFromCol(collectionID) {
        var res = await fetch(`https://localhost:5001/BookCollectionSpoj/RemoveBookFromCollection/${collectionID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: this.id
        });
        if (!res.ok)
            return false;
        return true;
    }

    async addToCollection(collection) {
        try {
            let res = await fetch(`https://localhost:5001/Book/AddBookToCollection/${this.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: collection
            });
            return res;
        } catch (err) {
            return (err.response);
        }
    }

    async loadAddToCol(container) {
        //add to collection button
        let controls = document.createElement("div");
        controls.className = "controls";

        //select collection
        let l = document.createElement("label");
        l.innerHTML = "Choose collection: "

        let selectCol = document.createElement("select");

        var collections = [];
        collections = await this.getCollections();
        collections.forEach(p => {
            var b = [];
            b = p.books;
            let op = document.createElement("option");
            op.innerHTML = p.name;
            op.value = p.id;
            selectCol.appendChild(op);
        });

        controls.appendChild(l);
        controls.appendChild(selectCol);

        //add to collection button
        let addBtn = document.createElement("button");
        addBtn.innerHTML = "Add";
        addBtn.className = "btn";
        addBtn.addEventListener("click", async () => {
            if (selectCol.selectedOptions.length == 0) {
                alert("⚠️ Unable to find collections.");
                return;
            }
            var res = await this.addToCollection(selectCol.value);
            if (res.ok) {
                alert("Book has been successfully added to collection. 👍");
            } else
                alert("⚠️ Book is already in this collection!")
        })

        controls.appendChild(addBtn);
        container.appendChild(controls);
    }
}