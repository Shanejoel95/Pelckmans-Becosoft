using System.Collections.Generic;

namespace BecoSoftAssignment.Models
{
    public class ProductDetailViewModel
    {
        public string Title { get; set; }
        public string SKU { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public bool InStock { get; set; }
        public List<string> ImageUrls { get; set; }
        public string SpecificationsHtml { get; set; }
        public List<ReviewViewModel> Reviews { get; set; }
        public List<RelatedProductViewModel> RelatedProducts { get; set; }
    }

    public class ReviewViewModel
    {
        public string Author { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }

    public class RelatedProductViewModel
    {
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
    }
}
