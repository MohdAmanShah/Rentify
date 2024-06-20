using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Database.Models
{
    public class SessionModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [ValidateNever]
        public string OwnerId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastModifiedDate { get; set; } = DateTime.UtcNow;
        [BsonIgnore]
        [ValidateNever]
        public UserModel? Owner { get; set; }
    }
}
