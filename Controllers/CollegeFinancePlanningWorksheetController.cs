using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Net.Http;
using System.Threading.Tasks;

namespace FAO_CFP_UI.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    /// <seealso cref="Microsoft.AspNetCore.Mvc.ControllerBase" />
    [Route("api/[controller]")]
    [ApiController]
    public class CollegeFinancePlanningWorksheetController : ControllerBase
    {
        [HttpGet]
        [Route("GetStudentWorksheetData/{uscId}/{academicYear}")]
        public async Task<WorksheetData> GetAsync(string uscId, string academicYear)
        {
            if (string.IsNullOrEmpty(uscId))
                return null;

            if (string.IsNullOrEmpty(academicYear))
                return null;

            using (var client = new HttpClient())
            {
                var url= new Uri("https://atapp-dev.usc.edu/UvApi/" + "subroutine/faoswebstatoffer/" + uscId + "/" + academicYear);
                var result = await client.GetAsync(url);
                result.EnsureSuccessStatusCode();
                string resultContentString = await result.Content.ReadAsStringAsync();
                var resultContent = JsonConvert.DeserializeObject<WorksheetData>(resultContentString);
                return resultContent;
            }
        }
    }
    /// <summary>
    /// 
    /// </summary>
    public class WorksheetData
    {
        public string AcademicYear { get; set; }
        public long? TuitionAndFees { get; set; }
        public long? BooksAndSupplies { get; set; }
        public long? Transportation { get; set; }
        public long? OtherEducationCosts { get; set; }
        public long? HousingAndMeals { get; set; }
        public long? UniversityGrants { get; set; }
        public long? PellGrant { get; set; }
        public long? StateGrants { get; set; }
        public long? WorkStudy { get; set; }
        public long? PerkinsLoans { get; set; }
        public long? SubStafford { get; set; }
        public long? OtherScholarships { get; set; }
        public long? UnsubStafford { get; set; }
        public long? Efc { get; set; }
        public string Message1 { get; set; }
        public string Message2 { get; set; }
        public string UsCiD { get; set; }
        public string StudentName { get; set; }
    }
}