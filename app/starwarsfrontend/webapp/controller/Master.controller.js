sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function (BaseController,MessageBox) {
    "use strict";

    return BaseController.extend("starwarsfrontend.controller.Master", {
        onInit: function () {
            // Si querés capturar rutas, lo hacés acá (no necesario por ahora)
            this.oEventBus = sap.ui.getCore().getEventBus()
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("start").attachPatternMatched(this._onRouteMatched, this);
            
        },

        _onRouteMatched: function(){
            sessionStorage.getItem("userID")
        },

        onSearchRequested: function(oEvent){
            const sQuery = oEvent.getParameter("query")

            this.oEventBus.publish("masterChanel","SearchRequest",{
                searchQuery : sQuery
            })
        },

        onCategorySelect: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext();
            const catId = oCtx.getProperty("id");

            const oRouter = this.getRouter()
            oRouter.navTo("CategoryFiltered",{categoryId:catId})
        },

        onShowCatalog:function(){
            //pensar en cambiar por que me parece una tactica muy sucia para filtrar
            this.oEventBus.publish("masterChanel","SearchRequest",{
                searchQuery : ""
            })
          },


        onSubcategorySelect: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext();
            const subcatId = oCtx.getProperty("id");
            const catId = oCtx.getProperty("category/id");
            
            const oRouter = this.getRouter()
            oRouter.navTo("SubcategoryFiltered",{categoryId:catId,subCategoryId:subcatId})
        },

        onPressHistory: function(){
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("PurchaseHistory")
        },

        onPressFavorites: function(){
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("Favorite")
        },

        onPressCart: function(){
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("Cart")
        },

        onPressCatalog: function(){
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("CategoryList")
        },

        onPressProfile: function(){
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("userProfile")

        },

        onLogOut: function(){
            sessionStorage.removeItem("userID")
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("start")
        }
    });
});
