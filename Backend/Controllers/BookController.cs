using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebProj.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        public BookLibraryContext Context { get; set; }
        public BookController(BookLibraryContext context)
        {
            Context = context;
        }


        [Route("GetAllBooks")]
        [HttpGet]
        public async Task<ActionResult> GetAllBooks()
        {
            try
            {
                var books = await Context.Books
                    .Select(b => new
                    {
                        b.ID,
                        b.Author.FirstName,
                        b.Author.LastName,
                        b.Title,
                        b.Collections
                    })
                    .ToListAsync();

                if (books.Count == 0)
                {
                    return BadRequest("No books found.");
                }

                return Ok(books);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("GetAuthorOfBook/{bookID}")]
        [HttpGet]
        public async Task<ActionResult> GetAuthorOfBook(int bookID)
        {
            try
            {
                var book = Context.Books.Where(p => p.ID == bookID);
                if (book == null || bookID <= 0)
                {
                    return BadRequest("Invalid ID. Book not found.");
                }

                var author = await book.Select(b => new
                {
                    ID = b.Author.ID,
                    FirstName = b.Author.FirstName,
                    LastName = b.Author.LastName

                }).ToListAsync();

                return Ok(author);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("AddBookToCollection/{bookID}")]
        [HttpPost]
        public async Task<ActionResult> AddBookToCollection([FromBody] int collectionID, int bookID)
        {
            try
            {
                if (collectionID <= 0 || bookID <= 0)
                {
                    return BadRequest("Invalid ID. Collection/book not found.");
                }

                var book = await Context.Books.FindAsync(bookID);
                var collection = await Context.BookCollections.FindAsync(collectionID);

                if (book == null || collection == null)
                {
                    return BadRequest("No such collection/book found.");
                }

                if (Context.BooksInCol.Any(o => o.Book == book && o.BookCollection == collection))
                {
                    return BadRequest("This book is already in this collection");
                };
                
                BookCollectionSpoj bcSpoj = new BookCollectionSpoj
                {
                    Book = book,
                    BookCollection = collection
                };

                Context.BooksInCol.Add(bcSpoj);
                await Context.SaveChangesAsync();
                book.Collections.Add(bcSpoj);

                return Ok($"'{book.Title}' has been added to collection '{collection.Name}'");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}