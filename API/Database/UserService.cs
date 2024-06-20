using Database.Models;
using DataModels;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Linq.Expressions;

namespace Database
{
    public class UserService
    {
        private readonly IMongoCollection<UserModel> _usersCollection;
        public UserService(IOptions<DatabaseSetting> databaseSettings)
        {
            IMongoClient client = new MongoClient(databaseSettings.Value.ConnectionString);
            var database = client.GetDatabase(databaseSettings.Value.DatabaseName);
            _usersCollection = database.GetCollection<UserModel>("users");
        }

        public async Task<List<UserModel>> GetAllAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

        public async Task<UserModel> GetOneAsync(Expression<Func<UserModel,bool>> filter)
        {
            return await _usersCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(UserModel newUser)
        {
            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
            await _usersCollection.InsertOneAsync(newUser);
        }

        public async Task<bool> UpdateAsync(string id, UserModel updatedUser)
        {
            var result = await _usersCollection.ReplaceOneAsync(user => user.Id == id, updatedUser);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _usersCollection.DeleteOneAsync(user => user.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
