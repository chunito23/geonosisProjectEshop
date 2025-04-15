sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, JSONModel) => {
    "use strict";

    return BaseController.extend("starwarsfrontend.controller.Favorite", {
        onInit() {
            const oRouter = this.getRouter();
            oRouter.getRoute("Favorite").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            const userId = sessionStorage.getItem("userID");
            this._loadFavorites(userId);
        },

        _loadFavorites: function (userId) {
            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/getUserFavorites", {
                method: "POST",
                urlParameters: {
                    userId: userId
                },
                success: (oData) => {

                    const oFavoritesModel = new JSONModel(oData.results || []);
                    this.getView().setModel(oFavoritesModel, "favorites");

                    if (!oData.results || oData.results.length === 0) {
                        MessageToast.show("No tienes productos favoritos");
                    }
                },
                error: (err) => {
                    console.error("Error al cargar favoritos:", err);
                    MessageToast.show("Error al cargar favoritos");
                }
            });
        },

        onDeleteFavorite: function (oEvent) {
            const oItem = oEvent.getParameter("listItem"); // 
            const oContext = oItem.getBindingContext("favorites");
            const ProductId = oContext.getProperty("product/id");
            const userId = sessionStorage.getItem("userID");

            const oModel = this.getOwnerComponent().getModel();

            oModel.callFunction("/DeleteFavorite", {
                method: "POST",
                urlParameters: {
                    userId: userId,
                    productId: ProductId
                },
                success: (oData) => {
                    console.log(oData);
                    MessageToast.show("Producto eliminado de favoritos");
                    // Refresh the favorites list
                    this._loadFavorites(userId);
                },
                error: (err) => {
                    console.error("Error al eliminar favoritos:", err);
                    MessageToast.show("Error al eliminar favoritos");
                }
            });
        },

        onNavBack: function () {
            this.getRouter().navTo("CategoryList");
        }
    });
});