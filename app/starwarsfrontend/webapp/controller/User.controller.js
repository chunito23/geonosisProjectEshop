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
        
            const authContent = oView.byId("authContent");
            const unauthContent = oView.byId("unauthContent");
        
            if (authContent && unauthContent) {
                if (userID) {
                    authContent.setVisible(true);
                    unauthContent.setVisible(false);
                } else {
                    authContent.setVisible(false);
                    unauthContent.setVisible(true);
                }
            }
        },

        onPressHistory: function(){
            let oRouter = this.getOwnerComponent().getRoute()
            oRouter.navTo("PurchaseHistory")
        },

        onPressFavorites: function(){
            let oRouter = this.getOwnerComponent().getRoute()
            oRouter.navTo("Favorite")
        },

        onPressCart: function(){
            let oRouter = this.getOwnerComponent().getRoute()
            oRouter.navTo("Cart")
        },

        onPressCatalog: function(){
            let oRouter = this.getOwnerComponent().getRoute()
            oRouter.navTo("CategoryList")
        },

        onPressProfile: function(){
            let oRouter = this.getOwnerComponent().getRoute()
            oRouter.navTo("start")

        },


        

    });
});