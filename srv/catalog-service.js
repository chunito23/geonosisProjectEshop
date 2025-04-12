const cds = require('@sap/cds')

module.exports = cds.service.impl(async function () {
  // Para depuración, vamos a imprimir las entidades disponibles
  console.log("Entidades disponibles:", Object.keys(this.entities));

  function generateUUID() {
    return cds.utils.uuid();
  }

  this.on('register', async req => {
    const { Users, Carts } = this.entities  // Cambiado a Users y Carts (plural)
    const { email, password } = req.data

    const existe = await SELECT.one.from(Users).where({ email })
    console.log(existe)
    if (existe) {
      return { success: false, userID: null }
    }

    const userID = generateUUID()

    await INSERT.into(Users).entries({
      id: userID,
      email,
      password
    })

    const cartID = generateUUID()
    await INSERT.into(Carts).entries({  // Cambiado a Carts (plural)
      id: cartID,
      user_id: userID  // Ajusta esto según el nombre real del campo en tu base de datos
    })

    return { success: true, userID: userID }
  })

  this.on('login', async (req) => {
    const { Users } = this.entities  // Cambiado a Users (plural)
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
  
    console.log("user id back: ", userId);
    console.log("product id back: ", productId);
  
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
  
})