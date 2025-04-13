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

            if (!userId) {
                MessageToast.show("Por favor, inicia sesión para ver tus favoritos");
                this.getRouter().navTo("start");
                return;
            }

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
                    console.log("Favoritos recibidos:", JSON.stringify(oData.results, null, 2));

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

        onNavBack: function () {
            this.getRouter().navTo("CategoryList");
        }
    });
});