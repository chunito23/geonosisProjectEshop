const cds = require('@sap/cds')

module.exports = cds.service.impl(async function() {
  // Para depuración, vamos a imprimir las entidades disponibles
  console.log("Entidades disponibles:", Object.keys(this.entities));
  
  function generateUUID() {
    return cds.utils.uuid();
  }

  this.on('register', async req => {
    const {Users, Carts} = this.entities  // Cambiado a Users y Carts (plural)
    const {email, password} = req.data
    
    const existe = await SELECT.one.from(Users).where({email})
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
    const {Users} = this.entities  // Cambiado a Users (plural)
    const { email, password } = req.data;
  
    const user = await SELECT.one.from(Users).where({ email });
    if (!user) return { success: false, userID: null };
  
    const valid = user.password === password;
    
    return { 
      success: valid, 
      userID: valid ? user.id : null 
    };
  });
})