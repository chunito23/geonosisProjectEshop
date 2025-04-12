sap.ui.define([
    "sap/ui/core/UIComponent",
    "starwarsfrontend/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("starwarsfrontend.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            //sessionStorage.removeItem("userID");
            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            

            // // Leer sesión del sessionStorage
            // const savedUserId = sessionStorage.getItem("userID");

            // // Interceptar navegación
            // const oRouter = this.getRouter();
            // oRouter.attachBeforeRouteMatched((oEvent) => {
            //     const routeName = oEvent.getParameter("name");


            //     if (savedUserId && routeName !== "start") {
            //         // Si no está logueado, redirigir al login
            //         this.getRouter().navTo("start");
            //         throw new Error("Bloqueo de ruta: usuario no autenticado");
            //     }
            // });

            // enable routing
            this.getRouter().initialize();
        }
    });
});