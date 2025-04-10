sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("starwarsfrontend.controller.Master", {
        onInit: function () {
            // Si querés capturar rutas, lo hacés acá (no necesario por ahora)
        },

        onItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();


            // Asegúrate de que el binding context existe
            if (oBindingContext) {
                var sPath = oBindingContext.getPath();
                var oModel = this.getView().getModel();
                var oData = oModel.getProperty(sPath);
                var categoria = oBindingContext.getProperty('category/name')
                var categoriaID = oBindingContext.getProperty('category/')

                var sSubcategoryId = oData.id;
                var sCategoryId = oData.category.id; // 

                // Usar los IDs como necesites
                console.log("Path:", sPath);
                console.log("Subcategory ID:", sSubcategoryId);
                console.log("Category ID:", sCategoryId);
                console.log("con getproperty \n")
                console.log("Category id:", categoriaID);
                console.log("Category Name:", categoria);
            }
        }

    });
});
