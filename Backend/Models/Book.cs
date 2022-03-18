using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{

    [Table("Book")]
    public class Book
    {

        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; }

        [JsonIgnore]
        // [Required]
        public Author Author { get; set; }

        [JsonIgnore]
        // [Required]
        public List<BookGenreSpoj> Genres { get; set; }
        
        [JsonIgnore]
        // [Required]
        public List<BookCollectionSpoj> Collections { get; set; }

    }
}