sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (BaseController, JSONModel, MessageToast) => {
    "use strict";

    return BaseController.extend("starwarsfrontend.controller.User", {
        onInit: function () {
            const oRouter = this.getRouter();
            oRouter.getRoute("userProfile").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            const userId = sessionStorage.getItem("userID");
            if (!userId) {
                MessageToast.show("No se encontró el ID del usuario en la sesión");
                return;
            }

            this._loadFavorites(userId);
            this._loadPurchases(userId);
            this._loadCartItems(userId);
            

            this.getView().bindElement({
                path: `/Users(${userId})`
            });
            
            
            
        },

        _loadFavorites: function (userId) {
            const oModel = this.getOwnerComponent().getModel();
            oModel.callFunction("/getUserFavorites", {
                method: "POST",
                urlParameters: { userId },
                success: (oData) => {
                    const favoriteModel = new JSONModel(oData.results || []);
                    this.getView().setModel(favoriteModel, "favorites");
                },
                error: (err) => {
                    console.error("Error al cargar favoritos:", err);
                    MessageToast.show("Error al cargar favoritos");
                }
            });
        },

        _loadCartItems: function (userId) {
            const oModel = this.getOwnerComponent().getModel();
            oModel.callFunction("/getUserCart", {
                method: "POST",
                urlParameters: { userId },
                success: (oData) => {
                    const cartModel = new JSONModel(oData.results || []);
                    this.getView().setModel(cartModel, "cartItems");
                },
                error: (err) => {
                    console.error("Error al cargar el carrito:", err);
                    MessageToast.show("Error al cargar el carrito");
                }
            });
        },

        _loadPurchases: function (userId) {
            const oModel = this.getOwnerComponent().getModel();
            oModel.callFunction("/getUserPurchases", {
                method: "POST",
                urlParameters: { userId },
                success: (oData) => {
                    const PurchaseModel = new JSONModel(oData.results || []);
                    this.getView().setModel(PurchaseModel, "purchases");
                },
                error: (err) => {
                    console.error("Error al cargar las compras:", err);
                    MessageToast.show("Error al cargar las compras");
                }
            });
        }
    });
});
