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


  action login(email : String, password : String)       returns {
    success : Boolean;
    userID : UUID;
  };

  action register(email : String, password : String)    returns {
    success : Boolean;
    userID : UUID;
  };

  action addFavorite(userId : UUID, productId : String) returns String;
  action addToCartItem(userId : UUID, productId : String) returns String;
  action deleteToCartItem(userId : UUID, productId : String) returns String;
  action clearCart(userId : UUID);
  action buyCart(userId : UUID);
  action getUserFavorites(userId : UUID)                returns array of FavItems;
  action getUserCart(userId : UUID)                returns array of CartItems;
  action decreaseToCartItem(userId : UUID, productId : String) returns String;
}
