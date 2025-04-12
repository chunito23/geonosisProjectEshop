using {com.starwars as starwars} from '../db/schema';

service CatalogService {
  entity Categories      as projection on starwars.Categories;
  entity Subcategories   as projection on starwars.Subcategories;
  entity Products        as projection on starwars.Products;
  entity ProductDetails  as projection on starwars.ProductDetails;
  entity ProductTags     as projection on starwars.ProductTags;
  entity ProductVariants as projection on starwars.ProductVariants;
  entity Users           as projection on starwars.User;
  entity Carts           as projection on starwars.Cart;
  entity CartItems       as projection on starwars.CartItem;
  entity FavItems        as projection on starwars.FavItem;
  entity PurchasedItems  as projection on starwars.PurchasedItem;


  action login(email : String, password : String)    returns {
    success : Boolean;
    userID : UUID;
  };

  action register(email : String, password : String) returns {
    success : Boolean;
    userID : UUID;
  };

  action addFavorite(userID : UUID);
  action addToCartItem(userID : UUID, productID : String);
  action DeleteToCartItem(userID : UUID, productID : String);
  action clearCart(userID : UUID);
  action BuyCart(userID : UUID)                      
}
