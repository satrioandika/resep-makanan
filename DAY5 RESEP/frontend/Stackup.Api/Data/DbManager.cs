using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;

namespace Name
{
    public class DbManager
    {
        private readonly string _connectionString;

        public DbManager(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public List<Resep> GetAllReseps()
        {
            List<Resep> resepList = new List<Resep>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(_connectionString))
                {
                    string query = "SELECT * FROM resep";
                    MySqlCommand command = new MySqlCommand(query, connection);
                    connection.Open();
                    using (MySqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Resep resep = new Resep
                            {
                                nama = reader["nama"].ToString(),
                                bahan = reader["bahan"].ToString(),
                                langkah = reader["langkah"].ToString(),
                            };
                            resepList.Add(resep);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return resepList;
        }

        public int CreateResep(Resep resep)
        {
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                string query = "INSERT INTO resep (nama, bahan, langkah) VALUES (@Nama, @Bahan, @Langkah)";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Nama", resep.nama);
                    command.Parameters.AddWithValue("@Bahan", resep.bahan);
                    command.Parameters.AddWithValue("@Langkah", resep.langkah);

                    connection.Open();
                    return command.ExecuteNonQuery();
                }
            }
        }

        public int DeleteResep(string nama)
        {
            using (MySqlConnection connection = new MySqlConnection(_connectionString))
            {
                string query = "DELETE FROM resep WHERE nama = @Nama";
                using (MySqlCommand command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Nama", nama);

                    connection.Open();
                    return command.ExecuteNonQuery();
                }
            }
        }
    }

    public class Resep
    {
        public string nama { get; set; }
        public string bahan { get; set; }
        public string langkah { get; set; }
    }
}
