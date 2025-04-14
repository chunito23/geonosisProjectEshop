sap.ui.define([
    "sap/ui/core/UIComponent",
    "starwarsfrontend/model/models",
    "sap/m/MessageBox",
    "sap/base/Log"
], (UIComponent, models, MessageBox, Log) => {
    "use strict";

    return UIComponent.extend("starwarsfrontend.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init: function () {
            // Llamar al método init del padre
            UIComponent.prototype.init.apply(this, arguments);

            // Inicializar modelos
            this.setModel(models.createDeviceModel(), "device");

            // Obtener referencia al router
            var oRouter = this.getRouter();
            oRouter.attachRouteMatched(this._onAnyRouteMatched, this);

            // Modelo para controlar visibilidad en views
            const oViewModel = new sap.ui.model.json.JSONModel({
                mostrarSeccion: false
            });
            this.setModel(oViewModel, "viewModel");


            // Proteger todas las rutas usando varios métodos para garantizar cobertura completa

            // 1. Sobrescribir navTo para navegación programática
            this._overrideNavTo(oRouter);

            // 2. Proteger rutas por URL con eventos del router
            this._setupRouteProtection(oRouter);

            // Inicializar el router al final
            oRouter.initialize();
        },

        _onAnyRouteMatched: function (oEvent) {
            const sRouteName = oEvent.getParameter("name");
            const oViewModel = this.getModel("viewModel");

            // Mostrar la sección solo si la ruta es 'productDetail'
            const bMostrar = (sRouteName === "CategoryList");
            console.log(bMostrar)
            oViewModel.setProperty("/mostrarSeccion", bMostrar);
        },

        _overrideNavTo: function (oRouter) {
            // Guardar referencia al método original navTo
            var fnOriginalNavTo = oRouter.navTo;
            var that = this;

            // Sobrescribir el método navTo
            oRouter.navTo = function (sRouteName, oParameters, bReplace) {
                Log.info("Navegando a ruta: " + sRouteName);

                // Si es ruta protegida, verificar autenticación
                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");

                    if (!userId) {
                        Log.warning("Intento de acceso sin autenticación a: " + sRouteName);
                        MessageBox.error("Debe iniciar sesión para acceder a esta página");
                        fnOriginalNavTo.call(this, "start", {}, true);
                        return;
                    }
                }

                // Si pasa verificación, permitir navegación
                fnOriginalNavTo.apply(this, arguments);
            };
        },

        _setupRouteProtection: function (oRouter) {
            // Proteger con eventos del router
            var that = this;

            // 1. Antes de que la ruta coincida (más temprano)
            oRouter.attachBeforeRouteMatched(function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                Log.info("beforeRouteMatched: " + sRouteName);

                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");
                    if (!userId) {
                        Log.warning("Bloqueando acceso por URL a: " + sRouteName);
                        oEvent.preventDefault();
                        MessageBox.error("Debe iniciar sesión para acceder a esta página");

                        // Importante: usar setTimeout para evitar problemas de timing
                        setTimeout(function () {
                            // Navegar a login usando el método original para evitar bucles
                            sap.m.routing.Router.prototype.navTo.call(oRouter, "start", {}, true);
                        }, 0);
                    }
                }
            });

            // 2. Cuando se encuentre una coincidencia de patrón (al inicio)
            oRouter.attachRoutePatternMatched(function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                Log.info("routePatternMatched: " + sRouteName);

                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");
                    if (!userId) {
                        Log.warning("Redirigiendo desde: " + sRouteName);
                        // Navegar a login de inmediato
                        oRouter.navTo("start", {}, true);
                    }
                }
            });

            // 3. Cuando la vista ya está cargada (último recurso)
            oRouter.attachRouteMatched(function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                Log.info("routeMatched: " + sRouteName);

                if (!that._isPublicRoute(sRouteName)) {
                    var userId = sessionStorage.getItem("userID");
                    if (!userId) {
                        Log.warning("Último intento de bloqueo: " + sRouteName);
                        // Navegar a login
                        oRouter.navTo("start", {}, true);
                    }
                }
            });
        },

        _isPublicRoute: function (sRouteName) {
            // Define aquí todas las rutas públicas que no requieren autenticación
            var aPublicRoutes = ["start", "CategoryList"];
            return aPublicRoutes.indexOf(sRouteName) !== -1;
        }
    });
});