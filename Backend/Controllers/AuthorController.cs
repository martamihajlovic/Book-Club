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
    public class AuthorController : ControllerBase
    {
        public BookLibraryContext Context { get; set; }
        public AuthorController(BookLibraryContext context)
        {
            Context = context;
        }


        [Route("GetAuthors")]
        [HttpGet]
        public async Task<ActionResult> GetAuthors()
        {
            try
            {
                var authors = await Context.Authors.Select(p => new
                {
                    p.ID,
                    p.FirstName,
                    p.LastName
                }).ToListAsync();

                if (authors.Count == 0)
                {
                    return BadRequest("No authors found.");
                }

                return Ok(authors);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("AddAuthor")]
        [HttpPost]
        public async Task<ActionResult> AddAuthor([FromBody] Author author)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(author.FirstName) || string.IsNullOrWhiteSpace(author.LastName))
                {
                    return BadRequest("Name cannot be empty!");
                }

                if (author.FirstName.Length > 50 || author.LastName.Length > 50)
                {
                    return BadRequest("Name cannot be over 50 characters.");
                }

                Context.Authors.Add(author);
                await Context.SaveChangesAsync();
                return Ok($"Author added! ID: {author.ID}");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("GetBooksByAuthor/{authorID}")]
        [HttpGet]
        public async Task<ActionResult> GetBooksByAuthor(int authorID)
        {
            try
            {
                var books = await Context.Books.Where(p => p.Author.ID == authorID).ToListAsync();
                if (authorID <= 0)
                {
                    return BadRequest("Invalid author.");
                }
                if (books.Count == 0)
                {
                    return BadRequest("There are no books by this author.");
                }

                return Ok(books);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
