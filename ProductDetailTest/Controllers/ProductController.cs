using System.Collections.Generic;
using System.Web.Mvc;
using BecoSoftAssignment.Models;
using Microsoft.AspNetCore.Mvc;

namespace BecoSoftAssignment.Controllers
{
    public class ProductController : Controller
    {
        public ActionResult Detail()
        {
            var model = new ProductDetailViewModel
            {
                Title = "Innovative School Backpack",
                SKU = "BAG-2025",
                Description = "Perfect for school or travel with a durable, stylish design.",
                Brand = "Eastpak",
                Price = 79.99m,
                DiscountedPrice = 59.99m,
                InStock = true,
                ImageUrls = new List<string>
                {
                    "/Content/images/Bag_image_01.jpg",
                    "/Content/images/Bag_image_02.jpg",
                    "/Content/images/Bag_image_03.jpg",
                    "/Content/images/Bag_image_04.jpg"
                },
                SpecificationsHtml = "<ul><li>Material: Recycled Polyester</li><li>Volume: 22L</li><li>Weight: 800g</li></ul>",
                Reviews = new List<ReviewViewModel>
                {
                    new ReviewViewModel { Author = "Emma", Rating = 5, Comment = "Excellent quality and perfect size!" },
                    new ReviewViewModel { Author = "Lucas", Rating = 4, Comment = "Comfortable straps and great color." }
                },
                RelatedProducts = new List<RelatedProductViewModel>
                {
                    new RelatedProductViewModel { Title = "School Backpack - Blue", ImageUrl = "/Content/images/Blue_backpack.jpg", Price = 49.99m },
                    new RelatedProductViewModel { Title = "Travel Backpack - Black", ImageUrl = "/Content/images/Travel_backpack_black.jpg", Price = 69.99m, DiscountedPrice = 54.99m },
                    new RelatedProductViewModel { Title = "Casual Daypack", ImageUrl = "/Content/images/Casual_daypack.jpg", Price = 39.99m },
                    new RelatedProductViewModel { Title = "Laptop Backpack", ImageUrl = "/Content/images/Laptop_backpack.jpg", Price = 89.99m, DiscountedPrice = 79.99m }
                }
            };

            return View(model);
        }
    }
}
