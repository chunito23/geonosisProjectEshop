module.exports = function (srv) {
  srv.on('greet', async (req) => {
     console.log("entre")
    const name = req.data.name || 'Misterioso';
    return `Señor ${name}`;
  });
};
