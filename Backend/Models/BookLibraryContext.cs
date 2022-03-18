using Microsoft.EntityFrameworkCore;

namespace Models
{

    public class BookLibraryContext : DbContext
    {

        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<BookCollection> BookCollections { get; set; }
        public DbSet<BookGenreSpoj> BooksGenres { get; set; }
        public DbSet<BookCollectionSpoj> BooksInCol { get; set; }

        public BookLibraryContext(DbContextOptions options) : base(options)
        {

        }
        // protected override void OnModelCreating(ModelBuilder modelBuilder){

        //     base.OnModelCreating(modelBuilder);
        //     modelBuilder.Entity<Book>()
        //                 .HasMany<BookGenreSpoj>()
        //                 .WithMany<
        // }
    }
}