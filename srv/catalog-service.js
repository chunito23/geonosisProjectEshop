const cds = require('@sap/cds')

module.exports = cds.service.impl(async function () {
  //imprimir las entidades disponibles
  console.log("Entidades disponibles:", Object.keys(this.entities));

  //genera ids
  function generateUUID() {
    return cds.utils.uuid();
  }

  this.on('register', async req => {
    const { Users, Carts } = this.entities
    const { email, password } = req.data

    const existe = await SELECT.one.from(Users).where({ email })
    if (existe) {
      return { success: false, userID: null }
    }

    const userID = generateUUID()

    await INSERT.into(Users).entries({
      id: userID,
      email,
      password
    })

    await INSERT.into(Carts).entries({
      id: generateUUID(),
      user_id: userID
    })

    return { success: true, userID: userID }
  })

  this.on('login', async (req) => {
    const { Users } = this.entities
    const { email, password } = req.data;

    const user = await SELECT.one.from(Users).where({ email });
    if (!user) return { success: false, userID: null };

    const valid = user.password === password;

    return {
      success: valid,
      userID: valid ? user.id : null
    };
  });

  this.on('addFavorite', async (req) => {
    const { Users, Products, FavItems } = this.entities;
    const { userId, productId } = req.data;

    const usuarioExistente = await SELECT.one.from(Users).where({ id: userId });
    if (!usuarioExistente) {
      return req.error(404, `Usuario con ID ${userId} no encontrado.`);
    }

    const productoExistente = await SELECT.one.from(Products).where({ id: productId });
    if (!productoExistente) {
      return req.error(404, `Producto con ID ${productId} no encontrado.`);
    }

    const favoritoExistente = await SELECT.one.from(FavItems).where({
      product_id: productId,
      user_id: userId
    });

    if (favoritoExistente) {
      return 'El producto ya estaba en favoritos.';
    }

    await INSERT.into(FavItems).entries({
      id: generateUUID(),
      product_id: productId,
      user_id: userId
    });

    return "insertado con éxito";
  });

  this.on('getUserFavorites', async (req) => {
    const { FavItems } = this.entities;
    const { userId } = req.data;

    if (!userId) {
      return req.error(400, "Parámetro userId es requerido");
    }
    // Consulta para obtener los ítems favoritos con detalles del producto
    const favorites = await cds.run(
      SELECT.from(FavItems)
        .where({ user_id: userId })
        .columns([
          { ref: ['id'] },
          {
            ref: ['product'],
            expand: [
              { ref: ['id'] },
              { ref: ['name'] },
              { ref: ['image'] },
              { ref: ['price'] }
            ]
          }
        ])
    );

    if (!favorites || favorites.length === 0) {
      return []; // Retorna un arreglo vacío si no hay favoritos
    }

    return favorites;
  });

  this.on("addToCartItem", async (req) => {
    const { Users, Products, Carts, CartItems } = this.entities
    const { userId, productId } = req.data

    const usuarioExistente = await SELECT.one.from(Users).where({ id: userId });
    if (!usuarioExistente) {
      return req.error(404, `Usuario con ID ${userId} no encontrado.`);
    }

    const productoExistente = await SELECT.one.from(Products).where({ id: productId });
    if (!productoExistente) {
      return req.error(404, `Producto con ID ${productId} no encontrado.`);
    }

    const carritoExistente = await SELECT.one.from(Carts).where({
      user_id: userId
    })
    if (!carritoExistente) {
      return req.error(404, `Carrito para el usuario con ID ${userId} no encontrado.`);
    }

    const productoEnCarritoExiste = await SELECT.one.from(CartItems).where({
      cart_id: carritoExistente.id,
      product_id: productoExistente.id
    })

    if (productoEnCarritoExiste) {
      await UPDATE(CartItems).set({ quantity: productoEnCarritoExiste.quantity + 1 }).where({
        id: productoEnCarritoExiste.id
      })
      return "cantidad incrementada"
    } else {
      await INSERT.into(CartItems).entries({
        id : generateUUID(),
        cart_id : carritoExistente.id,
        product_id : productoExistente.id,
        quantity : 1
      })
    }
    return "producto agregado"
  })

  this.on("getUserCart", async (req) => {
    const { Users, Carts, CartItems } = this.entities
    const { userId } = req.data

    const usuarioExistente = await SELECT.one.from(Users).where({ id: userId });
    if (!usuarioExistente) {
      return req.error(404, `Usuario con ID ${userId} no encontrado.`);
    }

    const carritoExistente = await SELECT.one.from(Carts).where({
      user_id: userId
    })
    if (!carritoExistente) {
      return req.error(404, `Carrito para el usuario con ID ${userId} no encontrado.`);
    }

    const itemsCarrito = await cds.run(
      SELECT.from(CartItems)
        .where({ cart_id : carritoExistente.id })
        .columns([
          { ref: ['id'] },
          {
            ref: ['product'],
            expand: [
              { ref: ['id'] },
              { ref: ['name'] },
              { ref: ['image'] },
              { ref: ['price'] }
            ]
          }
        ])
    );

    if (itemsCarrito){
      return itemsCarrito
    }else{
      return []
    }

  })

  this.on("DeleteToCartItem", async (req) => {
    const { Users, Products, Carts, CartItems } = this.entities
    const { userId, productId } = req.data

    const usuarioExistente = await SELECT.one.from(Users).where({ id: userId });
    if (!usuarioExistente) {
      return req.error(404, `Usuario con ID ${userId} no encontrado.`);
    }

    const productoExistente = await SELECT.one.from(Products).where({ id: productId });
    if (!productoExistente) {
      return req.error(404, `Producto con ID ${productId} no encontrado.`);
    }

    const carritoExistente = await SELECT.one.from(Carts).where({
      user_id: userId
    })
    if (!carritoExistente) {
      return req.error(404, `Carrito para el usuario con ID ${userId} no encontrado.`);
    }

    const productoEnCarritoExiste = await SELECT.one.from(CartItems).where({
      cart_id: carritoExistente.id,
      product_id: productoExistente.id
    })

    if (productoEnCarritoExiste) {
      if(productId.quantity > 1){
        await UPDATE(CartItems).set({ quantity: productoEnCarritoExiste.quantity - 1 }).where({
          id: productoEnCarritoExiste.id
        })
        return "cantidad derecrementada"
      }else{
        await DELETE(CartItems).where({
          id: productoEnCarritoExiste.id
        })
        return "producto eliminado"
      }
    }
    return "ERROR AL ELIMIANR EORWOL"
  })

})