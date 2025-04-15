sap.ui.define([
    "./BaseController"
], (BaseController) => {
    "use strict";
  
    return BaseController.extend("starwarsfrontend.controller.User", {
        onInit: function () {
            
            const oRouter = this.getRouter()
            oRouter.getRoute("userProfile").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(){
            const userId = sessionStorage.getItem("userID")
            this.getView().bindElement({
                path: "/Users(" + userId + ")",
                parameters : {
                  expand: "purchases,favorites,cart"
                }
              });
        },
        
        
        
    });
});