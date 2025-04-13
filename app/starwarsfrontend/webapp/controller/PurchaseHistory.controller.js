sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, JSONModel) => {
    "use strict";

    return BaseController.extend("starwarsfrontend.controller.PurchaseHistory", {
        onInit() {
            const oRouter = this.getRouter();
            oRouter.getRoute("PurchaseHistory").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            const userId = sessionStorage.getItem("userID");

            if (!userId) {
                MessageToast.show("Por favor, inicia sesión para ver tu historial de compras");
                this.getRouter().navTo("start");
                return;
            }

            //this._loadPurchases(userId);
        },

        _loadPurchases: function (userId) {
            const oModel = this.getOwnerComponent().getModel();

            // Asumimos que implementarás getUserPurchases
            oModel.callFunction("/getUserPurchases", {
                method: "POST",
                urlParameters: {
                    userId: userId
                },
                success: (oData) => {
                    console.log("Compras recibidas:", JSON.stringify(oData.results, null, 2));

                    const oPurchasesModel = new JSONModel(oData.results || []);
                    this.getView().setModel(oPurchasesModel, "purchases");

                    if (!oData.results || oData.results.length === 0) {
                        MessageToast.show("No tienes compras registradas");
                    }
                },
                error: (err) => {
                    console.error("Error al cargar las compras:", err);
                    MessageToast.show("Error al cargar las compras");
                }
            });
        },

        onNavBack: function () {
            this.getRouter().navTo("CategoryList");
        }
    });
});