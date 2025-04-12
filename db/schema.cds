namespace com.starwars;

entity Categories {
  key id            : String;
      name          : String;
      subcategories : Association to many Subcategories
                        on subcategories.category = $self;
}

entity Subcategories {
  key id       : String;
      name     : String;
      category : Association to one Categories;
      products : Association to many Products
                   on products.subcategory = $self;
}

entity Products {
  key id          : String;
      name        : String;
      price       : Decimal(10, 2);
      currency    : String;
      description : String;
      image       : String;
      stock       : Integer;
      rating      : Decimal(2, 1);
      subcategory : Association to one Subcategories;
      details     : Association to one ProductDetails
                      on details.product = $self;
      tags        : Association to many ProductTags
                      on tags.product = $self;
      variants    : Association to many ProductVariants
                      on variants.product = $self;
}

entity ProductDetails {
  key product      : Association to one Products;
      height       : String;
      length       : String;
      dimensions   : String;
      capacity     : String;
      material     : String;
      manufacturer : String;
      weight       : String;
      scale        : String;
}

entity ProductTags {
  key product : Association to one Products;
  key tag     : String;
}

entity ProductVariants {
  key variantId : String;
      product   : Association to one Products;
      color     : String;
      price     : Decimal(10, 2);
      stock     : Integer;
}

entity User {
  key id        : UUID;
      email     : String;
      password  : String; // solo para pruebas
      name      : String;
      cart      : Association to one Cart
                    on cart.user = $self;
      favorites : Association to many FavItem
                    on favorites.user = $self;
      purchases : Association to many PurchasedItem
                    on purchases.user = $self;
}

entity Cart {
  key id    : UUID;
      user  : Association to one User;
      items : Composition of many CartItem
                on items.cart = $self;
}

entity CartItem {
  key id       : UUID;
      cart     : Association to one Cart;
      product  : Association to one Products;
      //variant  : Association to one ProductVariants; //me genera problemas de inconsistencia
      quantity : Integer;
}

entity FavItem {
  key id       : UUID;
      user     : Association to one User;
      product  : Association to one Products;
}

entity PurchasedItem {
  key id       : UUID;
      user     : Association to one User;
      product  : Association to one Products;
}
