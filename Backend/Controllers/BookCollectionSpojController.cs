using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace WebProj.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class BookCollectionSpojController : ControllerBase
    {
        public BookLibraryContext Context { get; set; }
        public BookCollectionSpojController(BookLibraryContext context)
        {
            Context = context;
        }

        [Route("RemoveBookFromCollection/{collectionID}")]
        [HttpDelete]
        public async Task<ActionResult> RemoveBookFromCollection([FromBody] int bookID, int collectionID)
        {
            try
            {
                if (bookID <= 0 || collectionID <= 0)
                {
                    return BadRequest("Invalid book ID or collection ID");
                }

                var book = await Context.Books.FindAsync(bookID);
                var collection = await Context.BookCollections.FindAsync(collectionID);

                if (book == null || collection == null)
                {
                    return BadRequest("No such book/collection found.");
                }

                var bookcol = Context.BooksInCol.Where(p => p.Book == book && p.BookCollection == collection).FirstOrDefault();

                if (bookcol == null)
                {
                    return BadRequest("No connection between selected book and collection.");
                }

                Context.BooksInCol.Remove(bookcol);
                await Context.SaveChangesAsync();

                return Ok($"'{book.Title}' has been removed from collection '{collection.Name}'.");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}