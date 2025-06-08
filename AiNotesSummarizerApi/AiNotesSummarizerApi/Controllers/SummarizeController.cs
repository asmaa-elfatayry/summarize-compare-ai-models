using AiNotesSummarizerApi.models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace AiNotesSummarizerApi.Controllers
{
    public class NotesController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public NotesController(IConfiguration configuration)
        {
            _apiKey = configuration["HuggingFace:Token"];
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        //facebook/bart-large-cnn model
        public async Task<string> SummarizeText(string text)
        {
            var requestBody = new
            {
                inputs = text,
                parameters = new
                {
                    max_length = 100,
                    min_length = 30,
                    do_sample = false
                },
                options = new
                {
                    wait_for_model = true
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", content);

            var result = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return $"Error {response.StatusCode}: {result}";
            }

            return result;
        }


        [HttpPost("summarize")]
        public async Task<IActionResult> Summarize([FromBody] TextInputModel model)
        {
            var result = await SummarizeText(model.Text);
            return Ok(result);
        }

        public async Task<Dictionary<string, string>> SummarizeWithMultipleModels(string text)
        {
            var models = new List<string>
    {
        "facebook/bart-large-cnn",
        "google/pegasus-cnn_dailymail",
         "sshleifer/distilbart-cnn-12-6",
         "philschmid/bart-large-cnn-samsum"
    };

            var results = new Dictionary<string, string>();

            foreach (var model in models)
            {
                var summary = await SummarizeText(text, model);
                results[model] = summary;
            }

            return results;
        }

        public async Task<string> SummarizeText(string text, string model)
        {
            var requestBody = new
            {
                inputs = text,
                parameters = new
                {
                    max_length = 100,
                    min_length = 30,
                    do_sample = false
                },
                options = new
                {
                    wait_for_model = true
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var url = $"https://api-inference.huggingface.co/models/{model}";
            var response = await _httpClient.PostAsync(url, content);

            var result = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return $"Error {response.StatusCode}: {result}";
            }

            try
            {
                using JsonDocument doc = JsonDocument.Parse(result);
                var summaryText = doc.RootElement[0].GetProperty("summary_text").GetString();
                return summaryText ?? "No summary found";
            }
            catch
            {
                return "Error parsing summary";
            }
        }

        [HttpPost("compare-summaries")]
        public async Task<IActionResult> CompareSummaries([FromBody] TextInputModel model)
        {
            var results = await SummarizeWithMultipleModels(model.Text);
            return Ok(results);
        }

    

    }
}
