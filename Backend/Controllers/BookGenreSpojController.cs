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
    public class BookGenreController : ControllerBase
    {
        public BookLibraryContext Context { get; set; }
        public BookGenreController(BookLibraryContext context)
        {
            Context = context;
        }

        [Route("GetBooksByGenre/{genreID}")]
        [HttpGet]
        public async Task<ActionResult> GetBooksByGenre(int genreID)
        {
            try
            {
                if (genreID <= 0)
                {
                    return BadRequest("Invalid genre ID.");
                }

                var genre = await Context.Genres.FindAsync(genreID);

                if (genre == null)
                {
                    return BadRequest("No such genre found.");
                }
                var books = await Context.BooksGenres
                    .Where(p => p.Genre == genre)
                    .Include(p => p.Book)
                    .Select(p => new
                    {
                        id = p.Book.ID,
                        title = p.Book.Title,
                        authorFirstName = p.Book.Author.FirstName,
                        authorLastName = p.Book.Author.LastName,
                    })
                    .ToListAsync();

                return Ok(books);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}