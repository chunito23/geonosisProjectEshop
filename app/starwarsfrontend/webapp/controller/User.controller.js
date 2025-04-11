sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict";
  
    return BaseController.extend("starwarsfrontend.controller.User", {
        onInit: function(){
            // Obtener el router
            this.getOwnerComponent().getRouter().getRoute("start").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function() {
            // Actualizar la información del usuario cuando se navega a esta vista
            let oText = this.byId("emailUsuario");
            const userId = this.getUserID();
            oText.setText("ID de usuario: " + (userId || "No hay usuario logueado"));
        },

        getUserID: function() {
            const userModel = this.getOwnerComponent().getModel("userInfo");
            if (userModel) {
                return userModel.getProperty("/userID");
            }
            return null;
        }
    });
});