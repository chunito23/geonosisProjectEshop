const cds = require('@sap/cds')

module.exports = cds.service.impl(async function() {
  const {Users} = this.entities

  this.on('register', async req => {

    const {email,password} = req.data
    console.log(email , " " , password)

    const existe = await SELECT.one.from(Users).where({email})
    console.log(existe)
    if (existe){
      return false
    }

    await INSERT.into(Users).entries({email,password})
    return true
  })

  this.on('login', async (req) => {
    const {Users} = this.entities
    const { email, password } = req.data;
  
    const user = await SELECT.one.from(Users).where({ email });
    if (!user) return false;
  
    const valid = user.password === password; // luego mejorás con bcrypt
    return valid;
  });
})
  
