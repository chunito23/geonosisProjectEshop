sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict";
  
    return BaseController.extend("starwarsfrontend.controller.User", {
        onInit: function () {
            
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("start").attachPatternMatched(this._onRouteMatched, this);
        },
        
        _onRouteMatched: function () {
            const userID = sessionStorage.getItem("userID");
            const oView = this.getView();
            
        },
        
    });
});