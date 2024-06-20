using Database.Models;
using DataModels;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Database
{
    public class SessionService
    {
        private readonly IMongoCollection<SessionModel> _sessionsCollection;
        private readonly IMongoCollection<UserModel> _usersCollection;
        public SessionService(IOptions<DatabaseSetting> databaseSettings)
        {
            IMongoClient client = new MongoClient(
                databaseSettings.Value.ConnectionString);
            IMongoDatabase database = client.GetDatabase(databaseSettings.Value.DatabaseName);
            _sessionsCollection = database.GetCollection<SessionModel>("sessions");
            _usersCollection = database.GetCollection<UserModel>("users");
        }


        public async Task<List<SessionModel>> GetAllAsync(Expression<Func<SessionModel, bool>>? filter = null, bool IncludeProps = false)
        {
            if (filter == null)
            {
                return await _sessionsCollection.Find(_ => true).ToListAsync();
            }
            return await _sessionsCollection.Find(filter).ToListAsync();
        }

        public async Task<SessionModel> GetOneAsync(
            Expression<Func<SessionModel, bool>> filter, bool IncludeProps = false)
        {
            if (IncludeProps == false)
                return await _sessionsCollection.Find(filter).FirstOrDefaultAsync();

            SessionModel session = await _sessionsCollection.Find(filter).FirstOrDefaultAsync();
            if (session != null)
            {
                UserModel owner = await _usersCollection.Find(user => user.Id == session.OwnerId).FirstOrDefaultAsync();
                if (owner != null)
                {
                    session.Owner = owner;
                }
            }
            return session;
        }



        public async Task CreateAsync(SessionModel newSession)
        {
            await _sessionsCollection.InsertOneAsync(newSession);
        }

        public async Task<bool> UpdateAsync(string id, SessionModel updatededSession)
        {
            ReplaceOneResult result = await _sessionsCollection.ReplaceOneAsync(session => session.Id == id, updatededSession);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            DeleteResult result = await _sessionsCollection.DeleteOneAsync(session => session.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<bool> DeleteAllAsync()
        {
            DeleteResult result = await _sessionsCollection.DeleteManyAsync(_ => true);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

    }
}
