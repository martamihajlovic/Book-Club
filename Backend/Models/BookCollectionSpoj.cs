using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{

    [Table("BookCollectionSpoj")]
    public class BookCollectionSpoj
    {

        [Key]
        public int ID { get; set; }

        [JsonIgnore]
        // [Required]
        public Book Book { get; set; }

        [JsonIgnore]
        // [Required]
        public BookCollection BookCollection { get; set; }

    }
}