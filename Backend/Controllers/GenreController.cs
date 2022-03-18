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
    public class GenreController : ControllerBase
    {
        public BookLibraryContext Context { get; set; }
        public GenreController(BookLibraryContext context)
        {
            Context = context;
        }

        [Route("GetGenres")]
        [HttpGet]
        public async Task<ActionResult> GetGenres()
        {
            try
            {
                var genres = await Context.Genres
                    .Select(g => new
                    {
                        g.ID,
                        g.Name
                    })
                    .ToListAsync();

                if (genres.Count == 0)
                {
                    return BadRequest("No genres found.");
                }
                
                return Ok(genres);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("GetBookGenres/{bookID}")]
        [HttpGet]
        public async Task<ActionResult> GetBookGenres(int bookID)
        {
            try
            {
                if (bookID <= 0)
                {
                    return BadRequest("Invalid book ID.");
                }

                var book = await Context.Books.FindAsync(bookID);

                var genres = await Context.BooksGenres
                    .Where(p => p.Book == book)
                    .Include(p => p.Genre)
                    // .ToListAsync();
                    .Select(p => new
                    {
                        ID = p.Genre.ID,
                        name = p.Genre.Name,
                    })
                    .ToListAsync();

                return Ok(genres);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}