using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{

    [Table("BookCollection")]
    public class BookCollection
    {

        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(70)]
        public string Name { get; set; }

        [JsonIgnore]
        public List<BookCollectionSpoj> Books { get; set; }

    }
}