sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("starwarsfrontend.controller.Master", {
        onInit: function () {
            // Si querés capturar rutas, lo hacés acá (no necesario por ahora)
        },

        onCategorySelect: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext();
            const catId = oCtx.getProperty("id");

            const oRouter = this.getRouter()
            oRouter.navTo("CategoryFiltered",{categoryId:catId})
        },


        onSubcategorySelect: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext();
            const subcatId = oCtx.getProperty("id");
            const catId = oCtx.getProperty("category/id");
            
            const oRouter = this.getRouter()
            oRouter.navTo("SubcategoryFiltered",{categoryId:catId,subCategoryId:subcatId})
        }

    });
});
