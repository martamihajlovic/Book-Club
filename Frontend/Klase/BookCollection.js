import { Book } from "./Book.js";

export class BookCollection {
    constructor(id, name, cont) {
        this.id = id;
        this.name = name;
        this.container = cont;
        this.books = [];
        this.numOfBooks = 0;
    }

    /* ****************************
            LOAD COLLECTIONS
    ****************************** */
    async loadCollection() {

        const cont = document.createElement("div");
        cont.className = "colCont";
        cont.id = `collection${this.id}`

        await this.loadChangeName(cont);
        await this.loadColInfo(cont);
        await this.loadShowBooks(cont);
        await this.loadDeleteCol(cont, this.id);

        this.container.appendChild(cont)
    }


    /* ****************************
        LOAD COLLECTION INFO
    ****************************** */
    async loadColInfo(cont) {
        var emoji = document.createElement("h1");
        emoji.id = "emoji";
        emoji.innerHTML = "📚";
        var n = document.createElement("h2");
        n.innerHTML = this.name;

        var num = document.createElement("p");
        num.innerHTML = "Show and edit books<br>⬇️";

        cont.appendChild(emoji);
        cont.appendChild(n);
        cont.appendChild(num)

    }


    /* ****************************
        CREATE NEW COLLECTION
    ****************************** */
    async loadAddNewCol() {
        const cont = document.createElement("div");
        cont.className = "colCont";
        cont.id = "addNew";

        var p = document.createElement("h2");
        p.innerHTML = "Create new collection";

        var btn = document.createElement("button");
        btn.className = "btn";
        btn.innerHTML = "CREATE"

        cont.appendChild(btn);
        cont.appendChild(p);

        let visible = false;
        var f = null;
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (!visible) {
                f = await this.createFormAddNew(cont);
                if (f != null) {
                    cont.removeChild(p);
                    cont.appendChild(f);
                    btn.innerHTML = "QUIT";
                    visible = true;
                }
            } else {
                cont.removeChild(f);
                cont.appendChild(p);
                btn.innerHTML = "CREATE";
                // cont.appendChild(btn);
                visible = false;
            }
        });

        // cont.appendChild(f);
        this.container.appendChild(cont);
    }

    async createFormAddNew(cont) {
        var form = document.createElement("form");
        form.className = "addForm";

        var lab = document.createElement("label");
        lab.innerHTML = "Collection name: ";

        var nameInput = document.createElement("input");
        nameInput.setAttribute("type", "text");
        nameInput.required = true;
        nameInput.defaultValue = "Untitle";
        nameInput.value = "Untitled";
        nameInput.name = "name";

        var submit = document.createElement("button");
        submit.setAttribute("type", "submit");
        submit.className = "btn";
        submit.innerHTML = "Ok";

        form.addEventListener("submit", async (ev) => {
            ev.stopPropagation();
            if (nameInput.value === null || nameInput.value == " " || nameInput.value == "") {
                alert("⚠️ Name cannot be blank.");
                return;
            }

            const data = new FormData(form);
            data.append("name", nameInput.value);

            var res = await this.addNewCollection(data, cont);
            var p = ev.target;
            // console.log(p);
            if (res != null) {
                alert("Collection successfully created. 👍");
                // await res.loadCollection();

            } else {
                alert("⚠️ Could not create collection.");
                return null;
                // await this.loadCollection(res.id);
            }
        });

        form.appendChild(lab);
        form.appendChild(nameInput);
        form.appendChild(submit);
        return form;
    }

    async addNewCollection(formData, cont) {
        var res = await fetch(`https://localhost:5001/BookCollection/AddCollection`, {
            method: "POST",
            body: formData
        });
        if (!res.ok)
            return null;
        var d = await res.json();

        const newCol = new BookCollection(d.id, d.name, cont);
        console.log(newCol);
        return newCol;
    }


    /* ****************************
            DELETE COLLECTION
    ****************************** */
    async loadDeleteCol(cont, id) {
        var p = document.createElement("p");
        cont.appendChild(p);
        var btn = document.createElement("button");
        btn.className = "btn";
        btn.id = "delBtn";
        btn.innerHTML = "Delete";

        let prevName = this.name;
        btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this collection?")) {
                var f = await this.deleteCollection(id);
                var p = e.target;
                if (f) {
                    p.parentElement.remove();
                    alert(`Collection ${prevName} has successfully been deleted. 👍`);
                    // var col = p.parentElement;
                    // col.remove();
                }
                else {
                    alert("⚠️ Unable to delete selected collection.");
                }
            } else return;
        });
        cont.appendChild(btn);
    }

    async deleteCollection(id) {
        var res = await fetch(`https://localhost:5001/BookCollection/DeleteCollection/${id}`, {
            method: "DELETE",
        });
        if (!res.ok)
            return false;

        // this.container
        return true;
    }


    /* ****************************
        CHANGE COLLECTION NAME
    ****************************** */
    async loadChangeName(cont) {
        var btn = document.createElement("button");
        btn.innerHTML = "Rename";
        btn.className = "btn";

        var visible = false;
        var f = null;
        btn.addEventListener("click", async () => {
            if (!visible) {
                f = await this.createFormChangeName();
                cont.appendChild(f);
                visible = true;
            } else {
                f.remove();
                visible = false;
            }
        })
        cont.appendChild(btn);
    }

    async createFormChangeName() {
        var form = document.createElement("form");
        var prevName = this.name;

        var nameInput = document.createElement("input");
        nameInput.setAttribute("type", "text");
        nameInput.name = "Name";
        nameInput.value = this.name;
        nameInput.required = true;

        var submit = document.createElement("button");
        submit.setAttribute("type", "submit");
        submit.className = "btn";
        submit.innerHTML = "Ok";

        form.addEventListener("submit", async (ev) => {
            // ev.preventDefault();
            ev.stopPropagation();
            if (nameInput.value === null || nameInput.value == " " || nameInput.value == "") {
                alert("⚠️ Name cannot be blank.")
                return;
            } else if (nameInput.value == prevName) {
                alert("⚠️ New collection name is same as current name.");
                return;
            }

            var data = new FormData(form);
            data.append("newName", nameInput.value);

            var res = await this.changeCollectionName(data);
            if (res.ok) {
                var p = document.querySelector(`#collection${this.id}`);
                p.parentNode.removeChild(p);
                this.loadCollection();
                alert("Name of collection has successfully been changed. 👍");
            }
            else
                alert("⚠️ ERROR.");
        });

        form.appendChild(nameInput);
        form.appendChild(submit);
        // cont.appendChild(form);
        return form;
    }

    async changeCollectionName(formData) {
        var res = await fetch(`https://localhost:5001/BookCollection/ChangeCollectionName/${this.id}`, {
            method: "PUT",
            body: formData
        });
        // var data = await res.json();
        this.name = formData.get("newName");
        console.log(res)
        return res;
    }


    /* ****************************
        BOOKS FROM COLLECTION
    ****************************** */
    async loadShowBooks(cont) {
        var showing = false;
        var p = document.createElement("p");
        cont.appendChild(p);

        var btn = document.createElement("button");
        btn.className = "btn";
        btn.innerHTML = "Show";

        var list = null;

        btn.addEventListener("click", async () => {
            if (!showing) {
                list = await this.loadBooksFromCollection(cont);
                btn.innerHTML = "Close";
                showing = true;
            } else {
                cont.removeChild(list);
                btn.innerHTML = "Show";
                showing = false;
            }
        })
        cont.appendChild(btn);
    }

    async loadBooksFromCollection(cont) {
        let books = document.createElement("div");
        books.className = "colBooks";

        var list = document.createElement("ul");
        list.className = "list";

        fetch(`https://localhost:5001/BookCollection/GetBooksFromCollection/${this.id}`, {
            method: "GET"
        }).then(p => {
            p.json().then(books => {
                books.forEach(book => {
                    var b = new Book(book.id, book.title, cont);
                    this.books.push(b);

                    var listElement = document.createElement("li");

                    var btn = document.createElement("button");
                    btn.id = "removeBtn";
                    btn.innerHTML = "X"
                    btn.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to remove this book from this collection?")) {
                            var p = e.target;
                            if (await b.removeBookFromCol(this.id)) {
                                console.log("Book has been removed");
                                p.parentElement.remove();
                                await this.loadColInfo();
                            }
                            else {
                                console.log("greska");
                                // return;
                            }
                        }
                        else return;

                    });
                    listElement.innerHTML = book.title;
                    listElement.appendChild(btn);
                    list.appendChild(listElement);
                });
            });
        })

        books.appendChild(list);
        cont.appendChild(books);
        return books;
    }


}