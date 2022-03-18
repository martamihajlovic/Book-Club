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

    public class BookCollectionController : ControllerBase
    {
        public BookLibraryContext Context { get; set; }
        public BookCollectionController(BookLibraryContext context)
        {
            Context = context;
        }


        [Route("GetCollections")]
        [HttpGet]
        public ActionResult GetCollections()
        {
            try
            {
                var col = Context.BookCollections;
                if (col == null)
                {
                    return BadRequest("No collections found.");
                }

                var collections = col.Select(p => new
                {
                    p.ID,
                    p.Name,
                    p.Books
                });

                return Ok(collections);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("AddCollection")]
        [HttpPost]
        public async Task<ActionResult> AddCollection([FromForm] BookCollection bc)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(bc.Name))
                {
                    return BadRequest("Collection name cannot be blank.");
                }

                BookCollection newBC = new BookCollection
                {
                    Name = bc.Name
                };
                Context.BookCollections.Add(newBC);

                await Context.SaveChangesAsync();
                // return Ok($"New collection made with name '{bc.Name}'.");
                return Ok(newBC);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("ChangeCollectionName/{collectionID}")]
        [HttpPut]
        public async Task<ActionResult> ChangeCollectionName(int collectionID, [FromForm] string newName)
        {
            try
            {
                if (collectionID <= 0)
                {
                    return BadRequest("Invalid ID. No such collection found.");
                }

                var col = await Context.BookCollections.FindAsync(collectionID);
                if (col == null)
                {
                    return BadRequest("No such collection found.");
                }

                if (string.IsNullOrWhiteSpace(newName) || col.Name == newName)
                {
                    return BadRequest("Unable to make changes to collection name.");
                }

                col.Name = newName;
                await Context.SaveChangesAsync();

                return Ok($"Collection name was changed to '{col.Name}'.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("GetBooksFromCollection/{collectionID}")]
        [HttpGet]
        public async Task<ActionResult> GetBooksFromCollection(int collectionID)
        {
            try
            {
                var b = Context.BooksInCol.Where(p => p.BookCollection.ID == collectionID);

                if (collectionID <= 0)
                {
                    return BadRequest("Invalid collection ID. No such collection found.");
                }

                if (b == null)
                {
                    return BadRequest("No books found in collection.");
                }

                var books = await b.Select(p => new
                {
                    ID = p.Book.ID,
                    Title = p.Book.Title,
                    BookAuthor = p.Book.Author.ID
                }).ToListAsync();

                return Ok(books);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("DeleteCollection/{collectionID}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteCollection(int collectionID)
        {
            try
            {
                var collection = Context.BookCollections.Find(collectionID);

                if (collectionID <= 0 || collection == null)
                {
                    return BadRequest("Invalid collection ID. No such collection found.");
                }

                var books = await Context.BooksInCol.Where(p => p.BookCollection.ID == collectionID).ToListAsync();
                //trazi sve knjige iz kolekcije i uklanja ih iz je

                Context.BooksInCol.RemoveRange(books);
                Context.BookCollections.Remove(collection);
                await Context.SaveChangesAsync();

                return Ok($"Playlist '{collection.Name}' has been deleted and all books in it have been removed.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}