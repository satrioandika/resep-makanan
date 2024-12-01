using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace Name
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResepController : ControllerBase
    {
        private readonly DbManager _dbManager;
        private readonly Response response = new Response();

        public ResepController(IConfiguration configuration)
        {
            _dbManager = new DbManager(configuration);
        }

        [HttpGet]
        [Route("GetAllResep")]
        public IActionResult GetReseps()
        {
            try
            {
                response.status = 200;
                response.message = "Success";
                response.data = _dbManager.GetAllReseps();
            }
            catch (Exception ex)
            {
                response.status = 500;
                response.message = ex.Message;
            }
            return Ok(response);
        }

        [HttpPost]
        [Route("InsertResep")]
        public IActionResult CreateResep([FromBody] Resep resep)
        {
            try
            {
                response.status = 200;
                response.message = "Success";
                _dbManager.CreateResep(resep);
            }
            catch (Exception ex)
            {
                response.status = 500;
                response.message = ex.Message;
            }
            return Ok(response);
        }

        [HttpDelete("DeleteResep/{nama}")]
        public IActionResult DeleteResep(string nama)
        {
            try
            {
                response.status = 200;
                response.message = "Success";
                _dbManager.DeleteResep(nama);
            }
            catch (Exception ex)
            {
                response.status = 500;
                response.message = ex.Message;
            }
            return Ok(response);
        }
    }
}
