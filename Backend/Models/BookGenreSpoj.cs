using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{

    [Table("BookGenreSpoj")]
    public class BookGenreSpoj
    {

        [Key]
        public int ID { get; set; }

        [JsonIgnore]
        // [Required]
        public Book Book { get; set; }

        [JsonIgnore]
        // [Required]
        public Genre Genre { get; set; }

    }
}