sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (BaseController, MessageBox,Fragment) {
    "use strict";

    return BaseController.extend("starwarsfrontend.controller.Master", {
        onInit: function () {
            this.oEventBus = sap.ui.getCore().getEventBus()
            this.getView().setModel(this.getOwnerComponent().getModel("viewModel"), "viewModel");
        },



        onSearchRequested: function (oEvent) {
            const sQuery = oEvent.getParameter("query")

            this.oEventBus.publish("masterChanel", "SearchRequest", {
                searchQuery: sQuery
            })
        },

        onToggleMaster: function () {
            console.log("entre")
            //var oSplitApp = this.byId("splitApp"); // Si estás en App.controller
            // o
            var oSplitApp = this.getView().getParent().getParent(); // si estás en un controller hijo
            console.log(oSplitApp)
            if (oSplitApp.isMasterShown()) {
                oSplitApp.hideMaster();
            } else {
                oSplitApp.showMaster();
            }
        },

        onCategorySelect: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext();
            const catId = oCtx.getProperty("id");

            const oRouter = this.getRouter()
            oRouter.navTo("CategoryFiltered", { categoryId: catId })
        },

        onShowCatalog: function () {
            //pensar en cambiar por que me parece una tactica muy sucia para filtrar
            // ya me olvide para que lo usaba comprobar despues

            this.oEventBus.publish("masterChanel", "SearchRequest", {
                searchQuery: ""
            })
        },


        onSubcategorySelect: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext();
            const subcatId = oCtx.getProperty("id");
            const catId = oCtx.getProperty("category/id");

            const oRouter = this.getRouter()
            oRouter.navTo("SubcategoryFiltered", { categoryId: catId, subCategoryId: subcatId })
        },

        onPressHistory: function () {
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("PurchaseHistory")
        },

        onPressFavorites: function () {
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("Favorite")
        },

        onPressCart: function () {
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("Cart")
        },

        onPressCatalog: function () {
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("CategoryList")
        },

        onPressProfile: function () {
            //let oRouter = this.getOwnerComponent().getRouter()
            //oRouter.navTo("userProfile")

            var oView = this.getView(),
            oButton = oView.byId("userBotton");

            if (!this._oMenuFragment) {
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "starwarsfrontend.view.fragment.UserMenu",
                    controller: this
                }).then(function (oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            } else {
                this._oMenuFragment.openBy(oButton);
            }

        },

        onLogOut: function () {
            sessionStorage.removeItem("userID")
            let oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("start")
        }
    });
});
