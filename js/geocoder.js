!(function (t) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var e;
    (e =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this),
      (e.MapboxGeocoder = t());
  }
})(function () {
  var t;
  return (function () {
    function t(e, n, r) {
      function i(s, a) {
        if (!n[s]) {
          if (!e[s]) {
            var u = "function" == typeof require && require;
            if (!a && u) return u(s, !0);
            if (o) return o(s, !0);
            var c = new Error("Cannot find module '" + s + "'");
            throw ((c.code = "MODULE_NOT_FOUND"), c);
          }
          var l = (n[s] = { exports: {} });
          e[s][0].call(
            l.exports,
            function (t) {
              return i(e[s][1][t] || t);
            },
            l,
            l.exports,
            t,
            e,
            n,
            r
          );
        }
        return n[s].exports;
      }
      for (
        var o = "function" == typeof require && require, s = 0;
        s < r.length;
        s++
      )
        i(r[s]);
      return i;
    }
    return t;
  })()(
    {
      1: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            "@babel/helpers - typeof";
            return (r =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      "function" == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? "symbol"
                      : typeof t;
                  })(t);
          }
          function i(t) {
            (this.origin = t.origin || "https://api.mapbox.com"),
              (this.endpoint = "events/v2"),
              (this.access_token = t.accessToken),
              (this.version = "0.2.0"),
              (this.sessionID = this.generateSessionID()),
              (this.userAgent = this.getUserAgent()),
              (this.options = t),
              (this.send = this.send.bind(this)),
              (this.countries = t.countries ? t.countries.split(",") : null),
              (this.types = t.types ? t.types.split(",") : null),
              (this.bbox = t.bbox ? t.bbox : null),
              (this.language = t.language ? t.language.split(",") : null),
              (this.limit = t.limit ? +t.limit : null),
              (this.locale = navigator.language || null),
              (this.enableEventLogging = this.shouldEnableLogging(t)),
              (this.eventQueue = new Array()),
              (this.flushInterval = t.flushInterval || 1e3),
              (this.maxQueueSize = t.maxQueueSize || 100),
              (this.timer = this.flushInterval
                ? setTimeout(this.flush.bind(this), this.flushInterval)
                : null),
              (this.lastSentInput = ""),
              (this.lastSentIndex = 0);
          }
          var o = t("nanoid").nanoid;
          (i.prototype = {
            select: function (t, e) {
              var n = this.getSelectedIndex(t, e),
                r = this.getEventPayload("search.select", e);
              if (
                ((r.resultIndex = n),
                (r.resultPlaceName = t.place_name),
                (r.resultId = t.id),
                (n !== this.lastSentIndex ||
                  r.queryString !== this.lastSentInput) &&
                  -1 != n &&
                  ((this.lastSentIndex = n),
                  (this.lastSentInput = r.queryString),
                  r.queryString))
              )
                return this.push(r);
            },
            start: function (t) {
              var e = this.getEventPayload("search.start", t);
              if (e.queryString) return this.push(e);
            },
            keyevent: function (t, e) {
              if (
                t.key &&
                !t.metaKey &&
                -1 === [9, 27, 37, 39, 13, 38, 40].indexOf(t.keyCode)
              ) {
                var n = this.getEventPayload("search.keystroke", e);
                if (((n.lastAction = t.key), n.queryString))
                  return this.push(n);
              }
            },
            send: function (t, e) {
              if (this.enableEventLogging) {
                var n = this.getRequestOptions(t);
                this.request(
                  n,
                  function (t) {
                    return t ? this.handleError(t, e) : e ? e() : void 0;
                  }.bind(this)
                );
              } else if (e) return e();
            },
            getRequestOptions: function (t) {
              return (
                Array.isArray(t) || (t = [t]),
                {
                  method: "POST",
                  host: this.origin,
                  path: this.endpoint + "?access_token=" + this.access_token,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(t),
                }
              );
            },
            getEventPayload: function (t, e) {
              var n;
              n = e.options.proximity
                ? "object" === r(e.options.proximity)
                  ? [
                      e.options.proximity.longitude,
                      e.options.proximity.latitude,
                    ]
                  : "ip" === e.options.proximity
                  ? [999, 999]
                  : e.options.proximity
                : null;
              var i = e._map ? e._map.getZoom() : void 0,
                o = {
                  event: t,
                  created: +new Date(),
                  sessionIdentifier: this.sessionID,
                  country: this.countries,
                  userAgent: this.userAgent,
                  language: this.language,
                  bbox: this.bbox,
                  types: this.types,
                  endpoint: "mapbox.places",
                  autocomplete: e.options.autocomplete,
                  fuzzyMatch: e.options.fuzzyMatch,
                  proximity: n,
                  limit: e.options.limit,
                  routing: e.options.routing,
                  worldview: e.options.worldview,
                  mapZoom: i,
                  keyboardLocale: this.locale,
                  apiVersion: e.options.version,
                };
              return (
                "search.select" === t
                  ? (o.queryString = e.inputString)
                  : "search.select" != t && e._inputEl
                  ? (o.queryString = e._inputEl.value)
                  : (o.queryString = e.inputString),
                o
              );
            },
            request: function (t, e) {
              var n = new XMLHttpRequest();
              (n.onreadystatechange = function () {
                if (4 == this.readyState)
                  return e(204 == this.status ? null : this.statusText);
              }),
                n.open(t.method, t.host + "/" + t.path, !0);
              for (var r in t.headers) {
                var i = t.headers[r];
                n.setRequestHeader(r, i);
              }
              n.send(t.body);
            },
            handleError: function (t, e) {
              if (e) return e(t);
            },
            generateSessionID: function () {
              return o();
            },
            getUserAgent: function () {
              return (
                "mapbox-gl-geocoder." + this.version + "." + navigator.userAgent
              );
            },
            getSelectedIndex: function (t, e) {
              if (e._typeahead) {
                var n = e._typeahead.data,
                  r = t.id;
                return n
                  .map(function (t) {
                    return t.id;
                  })
                  .indexOf(r);
              }
            },
            shouldEnableLogging: function (t) {
              return (
                !1 !== t.enableEventLogging &&
                (!t.origin || "https://api.mapbox.com" === t.origin) &&
                !t.localGeocoder &&
                !t.filter
              );
            },
            flush: function () {
              this.eventQueue.length > 0 &&
                (this.send(this.eventQueue), (this.eventQueue = new Array())),
                this.timer && clearTimeout(this.timer),
                this.flushInterval &&
                  (this.timer = setTimeout(
                    this.flush.bind(this),
                    this.flushInterval
                  ));
            },
            push: function (t, e) {
              this.eventQueue.push(t),
                (this.eventQueue.length >= this.maxQueueSize || e) &&
                  this.flush();
            },
            remove: function () {
              this.flush();
            },
          }),
            (e.exports = i);
        },
        { nanoid: 33 },
      ],
      2: [
        function (t, e, n) {
          "use strict";
          e.exports = {
            fr: {
              name: "France",
              bbox: [
                [-4.59235, 41.380007],
                [9.560016, 51.148506],
              ],
            },
            us: {
              name: "United States",
              bbox: [
                [-171.791111, 18.91619],
                [-66.96466, 71.357764],
              ],
            },
            ru: {
              name: "Russia",
              bbox: [
                [19.66064, 41.151416],
                [190.10042, 81.2504],
              ],
            },
            ca: {
              name: "Canada",
              bbox: [
                [-140.99778, 41.675105],
                [-52.648099, 83.23324],
              ],
            },
          };
        },
        {},
      ],
      3: [
        function (t, e, n) {
          "use strict";
          function r() {}
          (r.prototype = {
            isSupport: function () {
              return Boolean(window.navigator.geolocation);
            },
            getCurrentPosition: function () {
              var t = { enableHighAccuracy: !0 };
              return new Promise(function (e, n) {
                window.navigator.geolocation.getCurrentPosition(e, n, t);
              });
            },
          }),
            (e.exports = r);
        },
        {},
      ],
      4: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            return a(t) || s(t) || o(t) || i();
          }
          function i() {
            throw new TypeError(
              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
            );
          }
          function o(t, e) {
            if (t) {
              if ("string" == typeof t) return u(t, e);
              var n = Object.prototype.toString.call(t).slice(8, -1);
              return (
                "Object" === n && t.constructor && (n = t.constructor.name),
                "Map" === n || "Set" === n
                  ? Array.from(t)
                  : "Arguments" === n ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                  ? u(t, e)
                  : void 0
              );
            }
          }
          function s(t) {
            if (
              ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
              null != t["@@iterator"]
            )
              return Array.from(t);
          }
          function a(t) {
            if (Array.isArray(t)) return u(t);
          }
          function u(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
            return r;
          }
          function c() {
            var t = document.createElement("div");
            return (
              (t.className = "mapboxgl-ctrl-geocoder--powered-by"),
              (t.innerHTML =
                '<a href="https://www.mapbox.com/search-service" target="_blank">Powered by Mapbox</a>'),
              t
            );
          }
          function l(t) {
            return t.place_name;
          }
          function h(t) {
            var e = t.place_name.split(",");
            return (
              '<div class="mapboxgl-ctrl-geocoder--suggestion"><div class="mapboxgl-ctrl-geocoder--suggestion-title">' +
              e[0] +
              '</div><div class="mapboxgl-ctrl-geocoder--suggestion-address">' +
              e.splice(1, e.length).join(",") +
              "</div></div>"
            );
          }
          function p(t) {
            var e = t.properties,
              n = e.name,
              r = e.place_formatted;
            return n + (r ? ", ".concat(r) : "");
          }
          function d(t) {
            var e = t.properties,
              n = e.name,
              r = e.place_formatted;
            return '<div class="mapboxgl-ctrl-geocoder--suggestion">\n      '
              .concat(
                n
                  ? '<div class="mapboxgl-ctrl-geocoder--suggestion-title">'.concat(
                      n,
                      "</div>"
                    )
                  : "",
                "\n      "
              )
              .concat(
                r
                  ? '<div class="mapboxgl-ctrl-geocoder--suggestion-address">'.concat(
                      r,
                      "</div>"
                    )
                  : "",
                "\n    </div>"
              );
          }
          function f(t) {
            (this._eventEmitter = new v()),
              (this.options = y(
                {},
                this.options,
                {
                  getItemValue: "v6" === t.version ? p : l,
                  render: "v6" === t.version ? d : h,
                },
                t
              )),
              (this.inputString = ""),
              (this.fresh = !0),
              (this.lastSelected = null),
              (this.geolocation = new k()),
              (this.geocoderFactory = "v6" === this.options.version ? x : w);
          }
          var m = t("suggestions"),
            g = t("lodash.debounce"),
            y = t("xtend"),
            v = t("events").EventEmitter,
            b = t("./exceptions"),
            _ = t("@mapbox/mapbox-sdk"),
            w = t("@mapbox/mapbox-sdk/services/geocoding"),
            x = t("@mapbox/mapbox-sdk/services/geocoding-v6"),
            E = t("./events"),
            O = t("./localization"),
            L = t("subtag"),
            k = t("./geolocation"),
            A = t("./utils"),
            S = { FORWARD: 0, LOCAL: 1, REVERSE: 2 };
          (f.prototype = {
            options: {
              zoom: 16,
              flyTo: !0,
              trackProximity: !0,
              minLength: 2,
              reverseGeocode: !1,
              flipCoordinates: !1,
              limit: 5,
              origin: "https://api.mapbox.com",
              enableEventLogging: !0,
              marker: !0,
              mapboxgl: null,
              collapsed: !1,
              clearAndBlurOnEsc: !1,
              clearOnBlur: !1,
              enableGeolocation: !1,
              addressAccuracy: "street",
              version: "v5",
            },
            addTo: function (t) {
              function e(t, e) {
                if (!document.body.contains(e))
                  throw new Error(
                    "Element provided to #addTo() exists, but is not in the DOM"
                  );
                var n = t.onAdd();
                e.appendChild(n);
              }
              if (t._controlContainer) t.addControl(this);
              else if (t instanceof HTMLElement) e(this, t);
              else {
                if ("string" != typeof t)
                  throw new Error(
                    "Error: addTo must be a mapbox-gl-js map, an html element, or a CSS selector query for a single html element"
                  );
                var n = document.querySelectorAll(t);
                if (0 === n.length)
                  throw new Error("Element ", t, "not found.");
                if (n.length > 1)
                  throw new Error(
                    "Geocoder can only be added to a single html element"
                  );
                e(this, n[0]);
              }
            },
            onAdd: function (t) {
              if (
                (t && "string" != typeof t && (this._map = t),
                this.setLanguage(),
                this.options.localGeocoderOnly ||
                  (this.geocoderService = this.geocoderFactory(
                    _({
                      accessToken: this.options.accessToken,
                      origin: this.options.origin,
                    })
                  )),
                this.options.localGeocoderOnly && !this.options.localGeocoder)
              )
                throw new Error(
                  "A localGeocoder function must be specified to use localGeocoderOnly mode"
                );
              (this.eventManager = new E(this.options)),
                (this._onChange = this._onChange.bind(this)),
                (this._onKeyDown = this._onKeyDown.bind(this)),
                (this._onPaste = this._onPaste.bind(this)),
                (this._onBlur = this._onBlur.bind(this)),
                (this._showButton = this._showButton.bind(this)),
                (this._hideButton = this._hideButton.bind(this)),
                (this._onQueryResult = this._onQueryResult.bind(this)),
                (this.clear = this.clear.bind(this)),
                (this._updateProximity = this._updateProximity.bind(this)),
                (this._collapse = this._collapse.bind(this)),
                (this._unCollapse = this._unCollapse.bind(this)),
                (this._clear = this._clear.bind(this)),
                (this._clearOnBlur = this._clearOnBlur.bind(this)),
                (this._geolocateUser = this._geolocateUser.bind(this));
              var e = (this.container = document.createElement("div"));
              e.className = "mapboxgl-ctrl-geocoder mapboxgl-ctrl";
              var n = this.createIcon(
                "search",
                '<path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"/>'
              );
              (this._inputEl = document.createElement("input")),
                (this._inputEl.type = "text"),
                (this._inputEl.className = "mapboxgl-ctrl-geocoder--input"),
                this.setPlaceholder(),
                this.options.collapsed &&
                  (this._collapse(),
                  this.container.addEventListener(
                    "mouseenter",
                    this._unCollapse
                  ),
                  this.container.addEventListener("mouseleave", this._collapse),
                  this._inputEl.addEventListener("focus", this._unCollapse)),
                (this.options.collapsed || this.options.clearOnBlur) &&
                  this._inputEl.addEventListener("blur", this._onBlur),
                this._inputEl.addEventListener(
                  "keydown",
                  g(this._onKeyDown, 200)
                ),
                this._inputEl.addEventListener("paste", this._onPaste),
                this._inputEl.addEventListener("change", this._onChange),
                this.container.addEventListener("mouseenter", this._showButton),
                this.container.addEventListener("mouseleave", this._hideButton),
                this._inputEl.addEventListener(
                  "keyup",
                  function (t) {
                    this.eventManager.keyevent(t, this);
                  }.bind(this)
                );
              var r = document.createElement("div");
              r.classList.add("mapboxgl-ctrl-geocoder--pin-right"),
                (this._clearEl = document.createElement("button")),
                this._clearEl.setAttribute("aria-label", "Clear"),
                this._clearEl.addEventListener("click", this.clear),
                (this._clearEl.className = "mapboxgl-ctrl-geocoder--button");
              var i = this.createIcon(
                "close",
                '<path d="M3.8 2.5c-.6 0-1.3.7-1.3 1.3 0 .3.2.7.5.8L7.2 9 3 13.2c-.3.3-.5.7-.5 1 0 .6.7 1.3 1.3 1.3.3 0 .7-.2 1-.5L9 10.8l4.2 4.2c.2.3.7.3 1 .3.6 0 1.3-.7 1.3-1.3 0-.3-.2-.7-.3-1l-4.4-4L15 4.6c.3-.2.5-.5.5-.8 0-.7-.7-1.3-1.3-1.3-.3 0-.7.2-1 .3L9 7.1 4.8 2.8c-.3-.1-.7-.3-1-.3z"/>'
              );
              if (
                (this._clearEl.appendChild(i),
                (this._loadingEl = this.createIcon(
                  "loading",
                  '<path fill="#333" d="M4.4 4.4l.8.8c2.1-2.1 5.5-2.1 7.6 0l.8-.8c-2.5-2.5-6.7-2.5-9.2 0z"/><path opacity=".1" d="M12.8 12.9c-2.1 2.1-5.5 2.1-7.6 0-2.1-2.1-2.1-5.5 0-7.7l-.8-.8c-2.5 2.5-2.5 6.7 0 9.2s6.6 2.5 9.2 0 2.5-6.6 0-9.2l-.8.8c2.2 2.1 2.2 5.6 0 7.7z"/>'
                )),
                r.appendChild(this._clearEl),
                r.appendChild(this._loadingEl),
                e.appendChild(n),
                e.appendChild(this._inputEl),
                e.appendChild(r),
                this.options.enableGeolocation && this.geolocation.isSupport())
              ) {
                (this._geolocateEl = document.createElement("button")),
                  this._geolocateEl.setAttribute("aria-label", "Geolocate"),
                  this._geolocateEl.addEventListener(
                    "click",
                    this._geolocateUser
                  ),
                  (this._geolocateEl.className =
                    "mapboxgl-ctrl-geocoder--button");
                var o = this.createIcon(
                  "geolocate",
                  '<path d="M12.999 3.677L2.042 8.269c-.962.403-.747 1.823.29 1.912l5.032.431.431 5.033c.089 1.037 1.509 1.252 1.912.29l4.592-10.957c.345-.822-.477-1.644-1.299-1.299z" fill="#4264fb"/>'
                );
                this._geolocateEl.appendChild(o),
                  r.appendChild(this._geolocateEl),
                  this._showGeolocateButton();
              }
              var s = (this._typeahead = new m(this._inputEl, [], {
                filter: !1,
                minLength: this.options.minLength,
                limit: this.options.limit,
              }));
              this.setRenderFunction(this.options.render),
                (s.getItemValue = this.options.getItemValue);
              var a = s.list.draw,
                u = (this._footerNode = c());
              return (
                (s.list.draw = function () {
                  a.call(this),
                    u.addEventListener(
                      "mousedown",
                      function () {
                        this.selectingListItem = !0;
                      }.bind(this)
                    ),
                    u.addEventListener(
                      "mouseup",
                      function () {
                        this.selectingListItem = !1;
                      }.bind(this)
                    ),
                    this.element.appendChild(u);
                }),
                (this.mapMarker = null),
                (this._handleMarker = this._handleMarker.bind(this)),
                this._map &&
                  (this.options.trackProximity &&
                    (this._updateProximity(),
                    this._map.on("moveend", this._updateProximity)),
                  (this._mapboxgl = this.options.mapboxgl),
                  !this._mapboxgl &&
                    this.options.marker &&
                    (console.error(
                      "No mapboxgl detected in options. Map markers are disabled. Please set options.mapboxgl."
                    ),
                    (this.options.marker = !1))),
                e
              );
            },
            _geolocateUser: function () {
              this._hideGeolocateButton(),
                this._showLoadingIcon(),
                this.geolocation
                  .getCurrentPosition()
                  .then(
                    function (t) {
                      this._hideLoadingIcon();
                      var e = {
                        geometry: {
                          type: "Point",
                          coordinates: [t.coords.longitude, t.coords.latitude],
                        },
                      };
                      this._handleMarker(e),
                        this._fly(e),
                        this._typeahead.clear(),
                        (this._typeahead.selected = !0),
                        (this.lastSelected = JSON.stringify(e)),
                        this._showClearButton(),
                        (this.fresh = !1);
                      var n =
                        "v6" === this.options.version
                          ? {
                              longitude: e.geometry.coordinates[0],
                              latitude: e.geometry.coordinates[1],
                              limit: 1,
                              language: this.options.language,
                              types: ["address"],
                            }
                          : {
                              limit: 1,
                              language: [this.options.language],
                              query: e.geometry.coordinates,
                              types: ["address"],
                            };
                      if (this.options.localGeocoderOnly) {
                        var r =
                          e.geometry.coordinates[0] +
                          "," +
                          e.geometry.coordinates[1];
                        this._setInputValue(r),
                          this._eventEmitter.emit("result", { result: e });
                      } else
                        this.geocoderService
                          .reverseGeocode(n)
                          .send()
                          .then(
                            function (t) {
                              var n = t.body.features[0];
                              if (n) {
                                var r = A.transformFeatureToGeolocationText(
                                  n,
                                  this.options.addressAccuracy
                                );
                                this._setInputValue(r),
                                  (n.user_coordinates = e.geometry.coordinates),
                                  this._eventEmitter.emit("result", {
                                    result: n,
                                  });
                              } else
                                this._eventEmitter.emit("result", {
                                  result: {
                                    user_coordinates: e.geometry.coordinates,
                                  },
                                });
                            }.bind(this)
                          );
                    }.bind(this)
                  )
                  .catch(
                    function (t) {
                      1 === t.code
                        ? this._renderUserDeniedGeolocationError()
                        : this._renderLocationError(),
                        this._hideLoadingIcon(),
                        this._showGeolocateButton(),
                        this._hideAttribution();
                    }.bind(this)
                  );
            },
            createIcon: function (t, e) {
              var n = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              return (
                n.setAttribute(
                  "class",
                  "mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-" +
                    t
                ),
                n.setAttribute("viewBox", "0 0 18 18"),
                n.setAttribute("xml:space", "preserve"),
                n.setAttribute("width", 18),
                n.setAttribute("height", 18),
                (n.innerHTML = e),
                n
              );
            },
            onRemove: function () {
              return (
                this.container.parentNode.removeChild(this.container),
                this.options.trackProximity &&
                  this._map &&
                  this._map.off("moveend", this._updateProximity),
                this._removeMarker(),
                (this._map = null),
                this
              );
            },
            _setInputValue: function (t) {
              (this._inputEl.value = t),
                setTimeout(
                  function () {
                    this._inputEl.focus(),
                      (this._inputEl.scrollLeft = 0),
                      this._inputEl.setSelectionRange(0, 0);
                  }.bind(this),
                  1
                );
            },
            _onPaste: function (t) {
              var e = (t.clipboardData || window.clipboardData).getData("text");
              e.length >= this.options.minLength && this._geocode(e);
            },
            _onKeyDown: function (t) {
              if (27 === t.keyCode && this.options.clearAndBlurOnEsc)
                return this._clear(t), this._inputEl.blur();
              var e =
                t.target && t.target.shadowRoot
                  ? t.target.shadowRoot.activeElement
                  : t.target;
              if (!(e ? e.value : ""))
                return (
                  (this.fresh = !0),
                  9 !== t.keyCode && this.clear(t),
                  this._showGeolocateButton(),
                  this._hideClearButton()
                );
              this._hideGeolocateButton(),
                t.metaKey ||
                  -1 !== [9, 27, 37, 39, 13, 38, 40].indexOf(t.keyCode) ||
                  (e.value.length >= this.options.minLength &&
                    this._geocode(e.value));
            },
            _showButton: function () {
              this._typeahead.selected && this._showClearButton();
            },
            _hideButton: function () {
              this._typeahead.selected && this._hideClearButton();
            },
            _showClearButton: function () {
              this._clearEl.style.display = "block";
            },
            _hideClearButton: function () {
              this._clearEl.style.display = "none";
            },
            _showGeolocateButton: function () {
              this._geolocateEl &&
                this.geolocation.isSupport() &&
                (this._geolocateEl.style.display = "block");
            },
            _hideGeolocateButton: function () {
              this._geolocateEl && (this._geolocateEl.style.display = "none");
            },
            _showLoadingIcon: function () {
              this._loadingEl.style.display = "block";
            },
            _hideLoadingIcon: function () {
              this._loadingEl.style.display = "none";
            },
            _showAttribution: function () {
              this._footerNode.style.display = "block";
            },
            _hideAttribution: function () {
              this._footerNode.style.display = "none";
            },
            _onBlur: function (t) {
              this.options.clearOnBlur && this._clearOnBlur(t),
                this.options.collapsed && this._collapse();
            },
            _onChange: function () {
              var t = this._typeahead.selected;
              t &&
                JSON.stringify(t) !== this.lastSelected &&
                (this._hideClearButton(),
                this.options.flyTo && this._fly(t),
                this.options.marker && this._mapboxgl && this._handleMarker(t),
                this._inputEl.focus(),
                (this._inputEl.scrollLeft = 0),
                this._inputEl.setSelectionRange(0, 0),
                (this.lastSelected = JSON.stringify(t)),
                this._eventEmitter.emit("result", { result: t }),
                this.eventManager.select(t, this));
            },
            _fly: function (t) {
              var e,
                n,
                r = "v6" === this.options.version ? t.properties.bbox : t.bbox;
              if (
                ("v6" === this.options.version &&
                "country" === t.properties.feature_type
                  ? (n =
                      t.properties.context.country.country_code.toLowerCase())
                  : "v5" === this.options.version &&
                    (n = t.properties && t.properties.short_code),
                t.properties && b[n])
              )
                (e = y({}, this.options.flyTo)),
                  this._map && this._map.fitBounds(b[n].bbox, e);
              else if (r)
                (e = y({}, this.options.flyTo)),
                  this._map &&
                    this._map.fitBounds(
                      [
                        [r[0], r[1]],
                        [r[2], r[3]],
                      ],
                      e
                    );
              else {
                var i = { zoom: this.options.zoom };
                (e = y({}, i, this.options.flyTo)),
                  t.center
                    ? (e.center = t.center)
                    : t.geometry &&
                      t.geometry.type &&
                      "Point" === t.geometry.type &&
                      t.geometry.coordinates &&
                      (e.center = t.geometry.coordinates),
                  this._map && this._map.flyTo(e);
              }
            },
            _requestType: function (t, e) {
              return t.localGeocoderOnly
                ? S.LOCAL
                : t.reverseGeocode && A.REVERSE_GEOCODE_COORD_RGX.test(e)
                ? S.REVERSE
                : S.FORWARD;
            },
            _setupConfig: function (t, e) {
              var n = ["fuzzyMatch", "routing", "reverseMode"],
                i = [
                  "bbox",
                  "limit",
                  "proximity",
                  "countries",
                  "types",
                  "language",
                  "mode",
                  "autocomplete",
                  "worldview",
                ],
                o = [].concat(r("v6" === this.options.version ? [] : n), i),
                s = ["countries", "types"].concat(
                  r("v6" === this.options.version ? [] : ["language"])
                ),
                a = /[\s,]+/,
                u = this,
                c = o.reduce(function (t, e) {
                  if (void 0 === u.options[e] || null === u.options[e])
                    return t;
                  s.indexOf(e) > -1
                    ? (t[e] = u.options[e].split(a))
                    : (t[e] = u.options[e]);
                  var n =
                    "number" == typeof u.options[e].longitude &&
                    "number" == typeof u.options[e].latitude;
                  if ("proximity" === e && n) {
                    var r = u.options[e].longitude,
                      i = u.options[e].latitude;
                    t[e] = [r, i];
                  }
                  return t;
                }, {});
              switch (t) {
                case S.REVERSE:
                  var l = e.split(a).map(function (t) {
                    return parseFloat(t, 10);
                  });
                  u.options.flipCoordinates || l.reverse(),
                    (c = y(
                      c,
                      "v6" === this.options.version
                        ? { longitude: l[0], latitude: l[1] }
                        : { query: l },
                      { limit: 1 }
                    ));
                  break;
                case S.FORWARD:
                  /^(-?\d{1,3}(\.\d{0,256})?)[, ]+(-?\d{1,3}(\.\d{0,256})?)?$/.test(
                    e.trim()
                  ) && (e = e.replace(/,/g, " ")),
                    (c = y(c, { query: e }));
              }
              return (
                "v6" === this.options.version &&
                  c.mode &&
                  ((c.permanent = "mapbox.places-permanent" === c.mode),
                  delete c.mode),
                []
                  .concat(
                    r(
                      t === S.REVERSE
                        ? ["proximity", "autocomplete", "fuzzyMatch", "bbox"]
                        : []
                    ),
                    r("v6" === this.options.version ? n : [])
                  )
                  .forEach(function (t) {
                    t in c && delete c[t];
                  }),
                c
              );
            },
            _geocode: function (t) {
              (this.inputString = t),
                this._showLoadingIcon(),
                this._eventEmitter.emit("loading", { query: t });
              var e,
                n = this._requestType(this.options, t),
                r = this._setupConfig(n, t);
              switch (n) {
                case S.LOCAL:
                  e = Promise.resolve();
                  break;
                case S.FORWARD:
                  e = this.geocoderService.forwardGeocode(r).send();
                  break;
                case S.REVERSE:
                  e = this.geocoderService.reverseGeocode(r).send();
              }
              var i = this.options.localGeocoder
                  ? this.options.localGeocoder(t) || []
                  : [],
                o = [],
                s = null;
              return (
                e
                  .catch(
                    function (t) {
                      s = t;
                    }.bind(this)
                  )
                  .then(
                    function (e) {
                      this._hideLoadingIcon();
                      var n = {};
                      return (
                        e
                          ? "200" == e.statusCode &&
                            ((n = e.body),
                            (n.request = e.request),
                            (n.headers = e.headers))
                          : (n = { type: "FeatureCollection", features: [] }),
                        (n.config = r),
                        this.fresh &&
                          (this.eventManager.start(this), (this.fresh = !1)),
                        (n.features = n.features ? i.concat(n.features) : i),
                        this.options.externalGeocoder
                          ? ((o =
                              this.options.externalGeocoder(t, n.features) ||
                              Promise.resolve([])),
                            o.then(
                              function (t) {
                                return (
                                  (n.features = n.features
                                    ? t.concat(n.features)
                                    : t),
                                  n
                                );
                              },
                              function () {
                                return n;
                              }
                            ))
                          : n
                      );
                    }.bind(this)
                  )
                  .then(
                    function (t) {
                      if (s) throw s;
                      this.options.filter &&
                        t.features.length &&
                        (t.features = t.features.filter(this.options.filter)),
                        t.features.length
                          ? (this._showClearButton(),
                            this._hideGeolocateButton(),
                            this._showAttribution(),
                            this._eventEmitter.emit("results", t),
                            this._typeahead.update(t.features))
                          : (this._hideClearButton(),
                            this._hideAttribution(),
                            (this._typeahead.selected = null),
                            this._renderNoResults(),
                            this._eventEmitter.emit("results", t));
                    }.bind(this)
                  )
                  .catch(
                    function (t) {
                      this._hideLoadingIcon(),
                        this._hideAttribution(),
                        (i.length && this.options.localGeocoder) ||
                        (o.length && this.options.externalGeocoder)
                          ? (this._showClearButton(),
                            this._hideGeolocateButton(),
                            this._typeahead.update(i))
                          : (this._hideClearButton(),
                            (this._typeahead.selected = null),
                            this._renderError()),
                        this._eventEmitter.emit("results", { features: i }),
                        this._eventEmitter.emit("error", { error: t });
                    }.bind(this)
                  ),
                e
              );
            },
            _clear: function (t) {
              t && t.preventDefault(),
                (this._inputEl.value = ""),
                (this._typeahead.selected = null),
                this._typeahead.clear(),
                this._onChange(),
                this._hideClearButton(),
                this._showGeolocateButton(),
                this._removeMarker(),
                (this.lastSelected = null),
                this._eventEmitter.emit("clear"),
                (this.fresh = !0);
            },
            clear: function (t) {
              this._clear(t), this._inputEl.focus();
            },
            _clearOnBlur: function (t) {
              var e = this;
              t.relatedTarget && e._clear(t);
            },
            _onQueryResult: function (t) {
              var e = t.body;
              if (e.features.length) {
                var n = e.features[0];
                (this._typeahead.selected = n),
                  (this._inputEl.value =
                    "v6" === this.options.version
                      ? n.properties.name +
                        (n.properties.place_formatted
                          ? ", ".concat(n.properties.place_formatted)
                          : "")
                      : n.place_name),
                  this._onChange();
              }
            },
            _updateProximity: function () {
              if (this._map && this.options.trackProximity)
                if (this._map.getZoom() > 9) {
                  var t = this._map.getCenter().wrap();
                  this.setProximity({ longitude: t.lng, latitude: t.lat }, !1);
                } else this.setProximity(null, !1);
            },
            _collapse: function () {
              this._inputEl.value ||
                this._inputEl === document.activeElement ||
                this.container.classList.add(
                  "mapboxgl-ctrl-geocoder--collapsed"
                );
            },
            _unCollapse: function () {
              this.container.classList.remove(
                "mapboxgl-ctrl-geocoder--collapsed"
              );
            },
            query: function (t) {
              return this._geocode(t).then(this._onQueryResult), this;
            },
            _renderError: function () {
              this._renderMessage(
                "<div class='mapbox-gl-geocoder--error'>There was an error reaching the server</div>"
              );
            },
            _renderLocationError: function () {
              this._renderMessage(
                "<div class='mapbox-gl-geocoder--error'>A location error has occurred</div>"
              );
            },
            _renderNoResults: function () {
              this._renderMessage(
                "<div class='mapbox-gl-geocoder--error mapbox-gl-geocoder--no-results'>No results found</div>"
              );
            },
            _renderUserDeniedGeolocationError: function () {
              this._renderMessage(
                "<div class='mapbox-gl-geocoder--error'>Geolocation permission denied</div>"
              );
            },
            _renderMessage: function (t) {
              this._typeahead.update([]),
                (this._typeahead.selected = null),
                this._typeahead.clear(),
                this._typeahead.renderError(t);
            },
            _getPlaceholderText: function () {
              if (this.options.placeholder) return this.options.placeholder;
              if (this.options.language) {
                var t = this.options.language.split(",")[0],
                  e = L.language(t),
                  n = O.placeholder[e];
                if (n) return n;
              }
              return "Search";
            },
            setInput: function (t) {
              return (
                (this._inputEl.value = t),
                (this._typeahead.selected = null),
                this._typeahead.clear(),
                t.length >= this.options.minLength && this._geocode(t),
                this
              );
            },
            setProximity: function (t) {
              var e =
                !(arguments.length > 1 && void 0 !== arguments[1]) ||
                arguments[1];
              return (
                (this.options.proximity = t),
                e && (this.options.trackProximity = !1),
                this
              );
            },
            getProximity: function () {
              return this.options.proximity;
            },
            setRenderFunction: function (t) {
              return (
                t && "function" == typeof t && (this._typeahead.render = t),
                this
              );
            },
            getRenderFunction: function () {
              return this._typeahead.render;
            },
            setLanguage: function (t) {
              var e =
                navigator.language ||
                navigator.userLanguage ||
                navigator.browserLanguage;
              return (
                (this.options.language = t || this.options.language || e), this
              );
            },
            getLanguage: function () {
              return this.options.language;
            },
            getZoom: function () {
              return this.options.zoom;
            },
            setZoom: function (t) {
              return (this.options.zoom = t), this;
            },
            getFlyTo: function () {
              return this.options.flyTo;
            },
            setFlyTo: function (t) {
              return (this.options.flyTo = t), this;
            },
            getPlaceholder: function () {
              return this.options.placeholder;
            },
            setPlaceholder: function (t) {
              return (
                (this.placeholder = t || this._getPlaceholderText()),
                (this._inputEl.placeholder = this.placeholder),
                this._inputEl.setAttribute("aria-label", this.placeholder),
                this
              );
            },
            getBbox: function () {
              return this.options.bbox;
            },
            setBbox: function (t) {
              return (this.options.bbox = t), this;
            },
            getCountries: function () {
              return this.options.countries;
            },
            setCountries: function (t) {
              return (this.options.countries = t), this;
            },
            getTypes: function () {
              return this.options.types;
            },
            setTypes: function (t) {
              return (this.options.types = t), this;
            },
            getMinLength: function () {
              return this.options.minLength;
            },
            setMinLength: function (t) {
              return (
                (this.options.minLength = t),
                this._typeahead && (this._typeahead.options.minLength = t),
                this
              );
            },
            getLimit: function () {
              return this.options.limit;
            },
            setLimit: function (t) {
              return (
                (this.options.limit = t),
                this._typeahead && (this._typeahead.options.limit = t),
                this
              );
            },
            getFilter: function () {
              return this.options.filter;
            },
            setFilter: function (t) {
              return (this.options.filter = t), this;
            },
            setOrigin: function (t) {
              return (
                (this.options.origin = t),
                (this.geocoderService = this.geocoderFactory(
                  _({
                    accessToken: this.options.accessToken,
                    origin: this.options.origin,
                  })
                )),
                this
              );
            },
            getOrigin: function () {
              return this.options.origin;
            },
            setAccessToken: function (t) {
              return (
                (this.options.accessToken = t),
                (this.geocoderService = this.geocoderFactory(
                  _({
                    accessToken: this.options.accessToken,
                    origin: this.options.origin,
                  })
                )),
                this
              );
            },
            setAutocomplete: function (t) {
              return (this.options.autocomplete = t), this;
            },
            getAutocomplete: function () {
              return this.options.autocomplete;
            },
            setFuzzyMatch: function (t) {
              return (this.options.fuzzyMatch = t), this;
            },
            getFuzzyMatch: function () {
              return this.options.fuzzyMatch;
            },
            setRouting: function (t) {
              return (this.options.routing = t), this;
            },
            getRouting: function () {
              return this.options.routing;
            },
            setWorldview: function (t) {
              return (this.options.worldview = t), this;
            },
            getWorldview: function () {
              return this.options.worldview;
            },
            _handleMarker: function (t) {
              if (this._map) {
                this._removeMarker();
                var e = { color: "#4668F2" },
                  n = y({}, e, this.options.marker);
                return (
                  (this.mapMarker = new this._mapboxgl.Marker(n)),
                  t.center
                    ? this.mapMarker.setLngLat(t.center).addTo(this._map)
                    : t.geometry &&
                      t.geometry.type &&
                      "Point" === t.geometry.type &&
                      t.geometry.coordinates &&
                      this.mapMarker
                        .setLngLat(t.geometry.coordinates)
                        .addTo(this._map),
                  this
                );
              }
            },
            _removeMarker: function () {
              this.mapMarker &&
                (this.mapMarker.remove(), (this.mapMarker = null));
            },
            on: function (t, e) {
              return this._eventEmitter.on(t, e), this;
            },
            off: function (t, e) {
              return (
                this._eventEmitter.removeListener(t, e),
                this.eventManager.remove(),
                this
              );
            },
          }),
            (e.exports = f);
        },
        {
          "./events": 1,
          "./exceptions": 2,
          "./geolocation": 3,
          "./localization": 5,
          "./utils": 6,
          "@mapbox/mapbox-sdk": 8,
          "@mapbox/mapbox-sdk/services/geocoding": 20,
          "@mapbox/mapbox-sdk/services/geocoding-v6": 19,
          events: 28,
          "lodash.debounce": 32,
          subtag: 36,
          suggestions: 37,
          xtend: 40,
        },
      ],
      5: [
        function (t, e, n) {
          "use strict";
          var r = {
            de: "Suche",
            it: "Ricerca",
            en: "Search",
            nl: "Zoeken",
            fr: "Chercher",
            ca: "Cerca",
            he: "לחפש",
            ja: "サーチ",
            lv: "Meklēt",
            pt: "Procurar",
            sr: "Претрага",
            zh: "搜索",
            cs: "Vyhledávání",
            hu: "Keresés",
            ka: "ძიება",
            nb: "Søke",
            sk: "Vyhľadávanie",
            th: "ค้นหา",
            fi: "Hae",
            is: "Leita",
            ko: "수색",
            pl: "Szukaj",
            sl: "Iskanje",
            fa: "جستجو",
            ru: "Поиск",
          };
          e.exports = { placeholder: r };
        },
        {},
      ],
      6: [
        function (t, e, n) {
          "use strict";
          function r(t, e) {
            var n,
              r = i(t),
              o = ["address", "street", "place", "country"];
            if ("function" == typeof e) return e(r);
            var s = o.indexOf(e);
            return (
              (n = -1 === s ? o : o.slice(s)),
              n.reduce(function (t, e) {
                return r[e] ? ("" !== t && (t += ", "), t + r[e]) : t;
              }, "")
            );
          }
          function i(t) {
            if (!s(t)) return o(t);
            var e = t.address || "",
              n = t.text || "",
              r = t.place_name || "",
              i = r.split(",")[0],
              a = { address: i, houseNumber: e, street: n, placeName: r };
            return (
              t.context.forEach(function (t) {
                var e = t.id.split(".")[0];
                a[e] = t.text;
              }),
              a
            );
          }
          function o(t) {
            var e = t.address_number || "",
              n = t.street || "",
              r =
                t.name +
                (t.place_formatted ? ", ".concat(t.place_formatted) : ""),
              i = t.name,
              o = { address: i, houseNumber: e, street: n, placeName: r };
            for (var s in t.context) s && (o[s] = t.context[s].name);
            return o;
          }
          var s = function (t) {
              return "id" in t;
            },
            a =
              /^[ ]*(-?\d{1,3}(\.\d{0,256})?)[, ]+(-?\d{1,3}(\.\d{0,256})?)[ ]*$/;
          e.exports = {
            transformFeatureToGeolocationText: r,
            getAddressInfo: i,
            REVERSE_GEOCODE_COORD_RGX: a,
          };
        },
        {},
      ],
      7: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            var e = Array.isArray(t),
              n = function (n) {
                return e ? t[n] : t;
              };
            return function (r) {
              var o = i(m.plainArray, r);
              if (o) return o;
              if (e && r.length !== t.length)
                return "an array with " + t.length + " items";
              for (var s = 0; s < r.length; s++)
                if ((o = i(n(s), r[s]))) return [s].concat(o);
            };
          }
          function i(t, e) {
            if (null != e || t.hasOwnProperty("__required")) {
              var n = t(e);
              return n ? (Array.isArray(n) ? n : [n]) : void 0;
            }
          }
          function o(t, e) {
            var n = t.length,
              r = t[n - 1],
              i = t.slice(0, n - 1);
            return (
              0 === i.length && (i = [f]),
              (e = d(e, { path: i })),
              "function" == typeof r ? r(e) : c(e, a(r))
            );
          }
          function s(t) {
            return t.length < 2
              ? t[0]
              : 2 === t.length
              ? t.join(" or ")
              : t.slice(0, -1).join(", ") + ", or " + t.slice(-1);
          }
          function a(t) {
            return "must be " + u(t) + ".";
          }
          function u(t) {
            return /^an? /.test(t)
              ? t
              : /^[aeiou]/i.test(t)
              ? "an " + t
              : /^[a-z]/i.test(t)
              ? "a " + t
              : t;
          }
          function c(t, e) {
            var n = l(t.path),
              r = t.path.join(".") + " " + e;
            return (n ? "Item at position " : "") + r;
          }
          function l(t) {
            return (
              "number" == typeof t[t.length - 1] || "number" == typeof t[0]
            );
          }
          function h(t) {
            return Object.keys(t || {}).map(function (e) {
              return { key: e, value: t[e] };
            });
          }
          var p = t("is-plain-obj"),
            d = t("xtend"),
            f = "value",
            m = {};
          (m.assert = function (t, e) {
            return (
              (e = e || {}),
              function (n) {
                var r = i(t, n);
                if (r) {
                  var s = o(r, e);
                  throw (e.apiName && (s = e.apiName + ": " + s), new Error(s));
                }
              }
            );
          }),
            (m.shape = function (t) {
              var e = h(t);
              return function (t) {
                var n = i(m.plainObject, t);
                if (n) return n;
                for (var r, s, a = [], u = 0; u < e.length; u++)
                  (r = e[u].key),
                    (s = e[u].value),
                    (n = i(s, t[r])) && a.push([r].concat(n));
                return a.length < 2
                  ? a[0]
                  : function (t) {
                      a = a.map(function (e) {
                        return (
                          "- " + e[0] + ": " + o(e, t).split("\n").join("\n  ")
                        );
                      });
                      var e = t.path.join(".");
                      return (
                        "The following properties" +
                        (e === f ? "" : " of " + e) +
                        " have invalid values:\n  " +
                        a.join("\n  ")
                      );
                    };
              };
            }),
            (m.strictShape = function (t) {
              var e = m.shape(t);
              return function (n) {
                var r = e(n);
                if (r) return r;
                var i = Object.keys(n).reduce(function (e, n) {
                  return void 0 === t[n] && e.push(n), e;
                }, []);
                return 0 !== i.length
                  ? function () {
                      return "The following keys are invalid: " + i.join(", ");
                    }
                  : void 0;
              };
            }),
            (m.arrayOf = function (t) {
              return r(t);
            }),
            (m.tuple = function () {
              return r(
                Array.isArray(arguments[0])
                  ? arguments[0]
                  : Array.prototype.slice.call(arguments)
              );
            }),
            (m.required = function (t) {
              function e(e) {
                return null == e
                  ? function (t) {
                      return c(
                        t,
                        l(t.path) ? "cannot be undefined/null." : "is required."
                      );
                    }
                  : t.apply(this, arguments);
              }
              return (e.__required = !0), e;
            }),
            (m.oneOfType = function () {
              var t = Array.isArray(arguments[0])
                ? arguments[0]
                : Array.prototype.slice.call(arguments);
              return function (e) {
                var n = t
                  .map(function (t) {
                    return i(t, e);
                  })
                  .filter(Boolean);
                if (n.length === t.length)
                  return n.every(function (t) {
                    return 1 === t.length && "string" == typeof t[0];
                  })
                    ? s(
                        n.map(function (t) {
                          return t[0];
                        })
                      )
                    : n.reduce(function (t, e) {
                        return e.length > t.length ? e : t;
                      });
              };
            }),
            (m.equal = function (t) {
              return function (e) {
                if (e !== t) return JSON.stringify(t);
              };
            }),
            (m.oneOf = function () {
              var t = Array.isArray(arguments[0])
                  ? arguments[0]
                  : Array.prototype.slice.call(arguments),
                e = t.map(function (t) {
                  return m.equal(t);
                });
              return m.oneOfType.apply(this, e);
            }),
            (m.range = function (t) {
              var e = t[0],
                n = t[1];
              return function (t) {
                if (i(m.number, t) || t < e || t > n)
                  return "number between " + e + " & " + n + " (inclusive)";
              };
            }),
            (m.any = function () {}),
            (m.boolean = function (t) {
              if ("boolean" != typeof t) return "boolean";
            }),
            (m.number = function (t) {
              if ("number" != typeof t) return "number";
            }),
            (m.plainArray = function (t) {
              if (!Array.isArray(t)) return "array";
            }),
            (m.plainObject = function (t) {
              if (!p(t)) return "object";
            }),
            (m.string = function (t) {
              if ("string" != typeof t) return "string";
            }),
            (m.func = function (t) {
              if ("function" != typeof t) return "function";
            }),
            (m.validate = i),
            (m.processMessage = o),
            (e.exports = m);
        },
        { "is-plain-obj": 31, xtend: 40 },
      ],
      8: [
        function (t, e, n) {
          "use strict";
          var r = t("./lib/client");
          e.exports = r;
        },
        { "./lib/client": 9 },
      ],
      9: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            s.call(this, t);
          }
          function i(t) {
            return new r(t);
          }
          var o = t("./browser-layer"),
            s = t("../classes/mapi-client");
          (r.prototype = Object.create(s.prototype)),
            (r.prototype.constructor = r),
            (r.prototype.sendRequest = o.browserSend),
            (r.prototype.abortRequest = o.browserAbort),
            (e.exports = i);
        },
        { "../classes/mapi-client": 11, "./browser-layer": 10 },
      ],
      10: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            var e = d[t.id];
            e && (e.abort(), delete d[t.id]);
          }
          function i(t, e) {
            return new c(t, {
              body: e.response,
              headers: p(e.getAllResponseHeaders()),
              statusCode: e.status,
            });
          }
          function o(t) {
            var e = t.total,
              n = t.loaded;
            return { total: e, transferred: n, percent: (100 * n) / e };
          }
          function s(t, e) {
            return new Promise(function (n, r) {
              e.onprogress = function (e) {
                t.emitter.emit(h.EVENT_PROGRESS_DOWNLOAD, o(e));
              };
              var i = t.file;
              i &&
                (e.upload.onprogress = function (e) {
                  t.emitter.emit(h.EVENT_PROGRESS_UPLOAD, o(e));
                }),
                (e.onerror = function (t) {
                  r(t);
                }),
                (e.onabort = function () {
                  var e = new l({ request: t, type: h.ERROR_REQUEST_ABORTED });
                  r(e);
                }),
                (e.onload = function () {
                  if ((delete d[t.id], e.status < 200 || e.status >= 400)) {
                    var i = new l({
                      request: t,
                      body: e.response,
                      statusCode: e.status,
                    });
                    return void r(i);
                  }
                  n(e);
                });
              var s = t.body;
              "string" == typeof s
                ? e.send(s)
                : s
                ? e.send(JSON.stringify(s))
                : i
                ? e.send(i)
                : e.send(),
                (d[t.id] = e);
            }).then(function (e) {
              return i(t, e);
            });
          }
          function a(t, e) {
            var n = t.url(e),
              r = new window.XMLHttpRequest();
            return (
              r.open(t.method, n),
              Object.keys(t.headers).forEach(function (e) {
                r.setRequestHeader(e, t.headers[e]);
              }),
              r
            );
          }
          function u(t) {
            return Promise.resolve().then(function () {
              var e = a(t, t.client.accessToken);
              return s(t, e);
            });
          }
          var c = t("../classes/mapi-response"),
            l = t("../classes/mapi-error"),
            h = t("../constants"),
            p = t("../helpers/parse-headers"),
            d = {};
          e.exports = {
            browserAbort: r,
            sendRequestXhr: s,
            browserSend: u,
            createRequestXhr: a,
          };
        },
        {
          "../classes/mapi-error": 12,
          "../classes/mapi-response": 14,
          "../constants": 15,
          "../helpers/parse-headers": 16,
        },
      ],
      11: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            if (!t || !t.accessToken)
              throw new Error("Cannot create a client without an access token");
            i(t.accessToken),
              (this.accessToken = t.accessToken),
              (this.origin = t.origin || s.API_ORIGIN);
          }
          var i = t("@mapbox/parse-mapbox-token"),
            o = t("./mapi-request"),
            s = t("../constants");
          (r.prototype.createRequest = function (t) {
            return new o(this, t);
          }),
            (e.exports = r);
        },
        {
          "../constants": 15,
          "./mapi-request": 13,
          "@mapbox/parse-mapbox-token": 26,
        },
      ],
      12: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            var e,
              n = t.type || i.ERROR_HTTP;
            if (t.body)
              try {
                e = JSON.parse(t.body);
              } catch (n) {
                e = t.body;
              }
            else e = null;
            var r = t.message || null;
            r ||
              ("string" == typeof e
                ? (r = e)
                : e && "string" == typeof e.message
                ? (r = e.message)
                : n === i.ERROR_REQUEST_ABORTED && (r = "Request aborted")),
              (this.message = r),
              (this.type = n),
              (this.statusCode = t.statusCode || null),
              (this.request = t.request),
              (this.body = e);
          }
          var i = t("../constants");
          e.exports = r;
        },
        { "../constants": 15 },
      ],
      13: [
        function (t, e, n) {
          "use strict";
          function r(t, e) {
            if (!t) throw new Error("MapiRequest requires a client");
            if (!e || !e.path || !e.method)
              throw new Error(
                "MapiRequest requires an options object with path and method properties"
              );
            var n = {};
            e.body && (n["content-type"] = "application/json");
            var r = o(n, e.headers),
              i = Object.keys(r).reduce(function (t, e) {
                return (t[e.toLowerCase()] = r[e]), t;
              }, {});
            (this.id = c++),
              (this._options = e),
              (this.emitter = new s()),
              (this.client = t),
              (this.response = null),
              (this.error = null),
              (this.sent = !1),
              (this.aborted = !1),
              (this.path = e.path),
              (this.method = e.method),
              (this.origin = e.origin || t.origin),
              (this.query = e.query || {}),
              (this.params = e.params || {}),
              (this.body = e.body || null),
              (this.file = e.file || null),
              (this.encoding = e.encoding || "utf8"),
              (this.sendFileAs = e.sendFileAs || null),
              (this.headers = i);
          }
          var i = t("@mapbox/parse-mapbox-token"),
            o = t("xtend"),
            s = t("eventemitter3"),
            a = t("../helpers/url-utils"),
            u = t("../constants"),
            c = 1;
          (r.prototype.url = function (t) {
            var e = a.prependOrigin(this.path, this.origin);
            e = a.appendQueryObject(e, this.query);
            var n = this.params,
              r = null == t ? this.client.accessToken : t;
            if (r) {
              e = a.appendQueryParam(e, "access_token", r);
              var s = i(r).user;
              n = o({ ownerId: s }, n);
            }
            return (e = a.interpolateRouteParams(e, n)), e;
          }),
            (r.prototype.send = function () {
              var t = this;
              if (t.sent)
                throw new Error(
                  "This request has already been sent. Check the response and error properties. Create a new request with clone()."
                );
              return (
                (t.sent = !0),
                t.client.sendRequest(t).then(
                  function (e) {
                    return (
                      (t.response = e), t.emitter.emit(u.EVENT_RESPONSE, e), e
                    );
                  },
                  function (e) {
                    throw ((t.error = e), t.emitter.emit(u.EVENT_ERROR, e), e);
                  }
                )
              );
            }),
            (r.prototype.abort = function () {
              this._nextPageRequest &&
                (this._nextPageRequest.abort(), delete this._nextPageRequest),
                this.response ||
                  this.error ||
                  this.aborted ||
                  ((this.aborted = !0), this.client.abortRequest(this));
            }),
            (r.prototype.eachPage = function (t) {
              function e(e) {
                function n() {
                  delete i._nextPageRequest;
                  var t = e.nextPage();
                  t && ((i._nextPageRequest = t), r(t));
                }
                t(null, e, n);
              }
              function n(e) {
                t(e, null, function () {});
              }
              function r(t) {
                t.send().then(e, n);
              }
              var i = this;
              r(this);
            }),
            (r.prototype.clone = function () {
              return this._extend();
            }),
            (r.prototype._extend = function (t) {
              var e = o(this._options, t);
              return new r(this.client, e);
            }),
            (e.exports = r);
        },
        {
          "../constants": 15,
          "../helpers/url-utils": 18,
          "@mapbox/parse-mapbox-token": 26,
          eventemitter3: 29,
          xtend: 40,
        },
      ],
      14: [
        function (t, e, n) {
          "use strict";
          function r(t, e) {
            (this.request = t),
              (this.headers = e.headers),
              (this.rawBody = e.body),
              (this.statusCode = e.statusCode);
            try {
              this.body = JSON.parse(e.body || "{}");
            } catch (t) {
              this.body = e.body;
            }
            this.links = i(this.headers.link);
          }
          var i = t("../helpers/parse-link-header");
          (r.prototype.hasNextPage = function () {
            return !!this.links.next;
          }),
            (r.prototype.nextPage = function () {
              return this.hasNextPage()
                ? this.request._extend({ path: this.links.next.url })
                : null;
            }),
            (e.exports = r);
        },
        { "../helpers/parse-link-header": 17 },
      ],
      15: [
        function (t, e, n) {
          "use strict";
          e.exports = {
            API_ORIGIN: "https://api.mapbox.com",
            EVENT_PROGRESS_DOWNLOAD: "downloadProgress",
            EVENT_PROGRESS_UPLOAD: "uploadProgress",
            EVENT_ERROR: "error",
            EVENT_RESPONSE: "response",
            ERROR_HTTP: "HttpError",
            ERROR_REQUEST_ABORTED: "RequestAbortedError",
          };
        },
        {},
      ],
      16: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            var e = t.indexOf(":");
            return {
              name: t.substring(0, e).trim().toLowerCase(),
              value: t.substring(e + 1).trim(),
            };
          }
          function i(t) {
            var e = {};
            return t
              ? (t
                  .trim()
                  .split(/[\r|\n]+/)
                  .forEach(function (t) {
                    var n = r(t);
                    e[n.name] = n.value;
                  }),
                e)
              : e;
          }
          e.exports = i;
        },
        {},
      ],
      17: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            var e = t.match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
            return e ? { key: e[1], value: e[2] } : null;
          }
          function i(t) {
            var e = t.match(/<?([^>]*)>(.*)/);
            if (!e) return null;
            var n = e[1],
              i = e[2].split(";"),
              o = null,
              s = i.reduce(function (t, e) {
                var n = r(e);
                return n
                  ? "rel" === n.key
                    ? (o || (o = n.value), t)
                    : ((t[n.key] = n.value), t)
                  : t;
              }, {});
            return o ? { url: n, rel: o, params: s } : null;
          }
          function o(t) {
            return t
              ? t.split(/,\s*</).reduce(function (t, e) {
                  var n = i(e);
                  return n
                    ? (n.rel.split(/\s+/).forEach(function (e) {
                        t[e] || (t[e] = { url: n.url, params: n.params });
                      }),
                      t)
                    : t;
                }, {})
              : {};
          }
          e.exports = o;
        },
        {},
      ],
      18: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            return t.map(encodeURIComponent).join(",");
          }
          function i(t) {
            return Array.isArray(t) ? r(t) : encodeURIComponent(String(t));
          }
          function o(t, e, n) {
            if (!1 === n || null === n) return t;
            var r = /\?/.test(t) ? "&" : "?",
              o = encodeURIComponent(e);
            return (
              void 0 !== n && "" !== n && !0 !== n && (o += "=" + i(n)),
              "" + t + r + o
            );
          }
          function s(t, e) {
            if (!e) return t;
            var n = t;
            return (
              Object.keys(e).forEach(function (t) {
                var r = e[t];
                void 0 !== r &&
                  (Array.isArray(r) &&
                    (r = r
                      .filter(function (t) {
                        return null !== t && void 0 !== t;
                      })
                      .join(",")),
                  (n = o(n, t, r)));
              }),
              n
            );
          }
          function a(t, e) {
            if (!e) return t;
            if ("http" === t.slice(0, 4)) return t;
            var n = "/" === t[0] ? "" : "/";
            return "" + e.replace(/\/$/, "") + n + t;
          }
          function u(t, e) {
            return e
              ? t.replace(/\/:([a-zA-Z0-9]+)/g, function (t, n) {
                  var r = e[n];
                  if (void 0 === r)
                    throw new Error("Unspecified route parameter " + n);
                  return "/" + i(r);
                })
              : t;
          }
          e.exports = {
            appendQueryObject: s,
            appendQueryParam: o,
            prependOrigin: a,
            interpolateRouteParams: u,
          };
        },
        {},
      ],
      19: [
        function (t, e, n) {
          "use strict";
          var r = t("xtend"),
            i = t("./service-helpers/validator"),
            o = t("./service-helpers/pick"),
            s = t("./service-helpers/stringify-booleans"),
            a = t("./service-helpers/create-service-factory"),
            u = {},
            c = [
              "street",
              "country",
              "region",
              "postcode",
              "district",
              "place",
              "locality",
              "neighborhood",
              "address",
            ];
          (u.forwardGeocode = function (t) {
            (t.mode = t.mode || "standard"),
              i.assertShape(
                r(
                  "standard" === t.mode ? { query: i.required(i.string) } : {},
                  {
                    mode: i.oneOf("standard", "structured"),
                    countries:
                      "standard" === t.mode ? i.arrayOf(i.string) : i.string,
                    proximity: i.oneOf(i.coordinates, "ip"),
                    types: i.arrayOf(i.oneOf(c)),
                    bbox: i.arrayOf(i.number),
                    format: i.oneOf("geojson", "v5"),
                    language: i.string,
                    limit: i.number,
                    worldview: i.string,
                    autocomplete: i.boolean,
                    permanent: i.boolean,
                    address_line1: i.string,
                    address_number: i.string,
                    street: i.string,
                    block: i.string,
                    place: i.string,
                    region: i.string,
                    neighborhood: i.string,
                    postcode: i.string,
                    locality: i.string,
                  }
                )
              )(t);
            var e = s(
              r(
                "standard" === t.mode
                  ? { q: t.query }
                  : o(t, [
                      "address_line1",
                      "address_number",
                      "street",
                      "block",
                      "place",
                      "region",
                      "neighborhood",
                      "postcode",
                      "locality",
                    ]),
                { country: t.countries },
                o(t, [
                  "proximity",
                  "types",
                  "bbox",
                  "format",
                  "language",
                  "limit",
                  "worldview",
                  "autocomplete",
                  "permanent",
                ])
              )
            );
            return this.client.createRequest({
              method: "GET",
              path: "/search/geocode/v6/forward",
              query: e,
            });
          }),
            (u.reverseGeocode = function (t) {
              i.assertShape({
                longitude: i.required(i.number),
                latitude: i.required(i.number),
                countries: i.arrayOf(i.string),
                types: i.arrayOf(i.oneOf(c)),
                limit: i.number,
                language: i.string,
                worldview: i.string,
                permanent: i.boolean,
              })(t);
              var e = s(
                r(
                  { country: t.countries },
                  o(t, [
                    "longitude",
                    "latitude",
                    "types",
                    "limit",
                    "language",
                    "worldview",
                    "permanent",
                  ])
                )
              );
              return this.client.createRequest({
                method: "GET",
                path: "/search/geocode/v6/reverse",
                query: e,
              });
            }),
            (e.exports = a(u));
        },
        {
          "./service-helpers/create-service-factory": 21,
          "./service-helpers/pick": 23,
          "./service-helpers/stringify-booleans": 24,
          "./service-helpers/validator": 25,
          xtend: 40,
        },
      ],
      20: [
        function (t, e, n) {
          "use strict";
          var r = t("xtend"),
            i = t("./service-helpers/validator"),
            o = t("./service-helpers/pick"),
            s = t("./service-helpers/stringify-booleans"),
            a = t("./service-helpers/create-service-factory"),
            u = {},
            c = [
              "country",
              "region",
              "postcode",
              "district",
              "place",
              "locality",
              "neighborhood",
              "address",
              "poi",
              "poi.landmark",
            ];
          (u.forwardGeocode = function (t) {
            i.assertShape({
              query: i.required(i.string),
              mode: i.oneOf("mapbox.places", "mapbox.places-permanent"),
              countries: i.arrayOf(i.string),
              proximity: i.oneOf(i.coordinates, "ip"),
              types: i.arrayOf(i.oneOf(c)),
              autocomplete: i.boolean,
              bbox: i.arrayOf(i.number),
              limit: i.number,
              language: i.arrayOf(i.string),
              routing: i.boolean,
              fuzzyMatch: i.boolean,
              worldview: i.string,
            })(t),
              (t.mode = t.mode || "mapbox.places");
            var e = s(
              r(
                { country: t.countries },
                o(t, [
                  "proximity",
                  "types",
                  "autocomplete",
                  "bbox",
                  "limit",
                  "language",
                  "routing",
                  "fuzzyMatch",
                  "worldview",
                ])
              )
            );
            return this.client.createRequest({
              method: "GET",
              path: "/geocoding/v5/:mode/:query.json",
              params: o(t, ["mode", "query"]),
              query: e,
            });
          }),
            (u.reverseGeocode = function (t) {
              i.assertShape({
                query: i.required(i.coordinates),
                mode: i.oneOf("mapbox.places", "mapbox.places-permanent"),
                countries: i.arrayOf(i.string),
                types: i.arrayOf(i.oneOf(c)),
                bbox: i.arrayOf(i.number),
                limit: i.number,
                language: i.arrayOf(i.string),
                reverseMode: i.oneOf("distance", "score"),
                routing: i.boolean,
                worldview: i.string,
              })(t),
                (t.mode = t.mode || "mapbox.places");
              var e = s(
                r(
                  { country: t.countries },
                  o(t, [
                    "country",
                    "types",
                    "bbox",
                    "limit",
                    "language",
                    "reverseMode",
                    "routing",
                    "worldview",
                  ])
                )
              );
              return this.client.createRequest({
                method: "GET",
                path: "/geocoding/v5/:mode/:query.json",
                params: o(t, ["mode", "query"]),
                query: e,
              });
            }),
            (e.exports = a(u));
        },
        {
          "./service-helpers/create-service-factory": 21,
          "./service-helpers/pick": 23,
          "./service-helpers/stringify-booleans": 24,
          "./service-helpers/validator": 25,
          xtend: 40,
        },
      ],
      21: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            return function (e) {
              var n;
              n = i.prototype.isPrototypeOf(e) ? e : o(e);
              var r = Object.create(t);
              return (r.client = n), r;
            };
          }
          var i = t("../../lib/classes/mapi-client"),
            o = t("../../lib/client");
          e.exports = r;
        },
        { "../../lib/classes/mapi-client": 11, "../../lib/client": 9 },
      ],
      22: [
        function (t, e, n) {
          "use strict";
          function r(t, e) {
            return Object.keys(t).reduce(function (n, r) {
              return (n[r] = e(r, t[r])), n;
            }, {});
          }
          e.exports = r;
        },
        {},
      ],
      23: [
        function (t, e, n) {
          "use strict";
          function r(t, e) {
            var n = function (t, n) {
              return -1 !== e.indexOf(t) && void 0 !== n;
            };
            return (
              "function" == typeof e && (n = e),
              Object.keys(t)
                .filter(function (e) {
                  return n(e, t[e]);
                })
                .reduce(function (e, n) {
                  return (e[n] = t[n]), e;
                }, {})
            );
          }
          e.exports = r;
        },
        {},
      ],
      24: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            return i(t, function (t, e) {
              return "boolean" == typeof e ? JSON.stringify(e) : e;
            });
          }
          var i = t("./object-map");
          e.exports = r;
        },
        { "./object-map": 22 },
      ],
      25: [
        function (t, e, n) {
          (function (n) {
            (function () {
              "use strict";
              function r(t) {
                if ("undefined" != typeof window) {
                  if (t instanceof n.Blob || t instanceof n.ArrayBuffer) return;
                  return "Blob or ArrayBuffer";
                }
                if ("string" != typeof t && void 0 === t.pipe)
                  return "Filename or Readable stream";
              }
              function i(t, e) {
                return u.assert(u.strictShape(t), e);
              }
              function o(t) {
                if ("boolean" == typeof t) return "date";
                try {
                  var e = new Date(t);
                  if (e.getTime && isNaN(e.getTime())) return "date";
                } catch (t) {
                  return "date";
                }
              }
              function s(t) {
                return u.tuple(u.number, u.number)(t);
              }
              var a = t("xtend"),
                u = t("@mapbox/fusspot");
              e.exports = a(u, {
                file: r,
                date: o,
                coordinates: s,
                assertShape: i,
              });
            }).call(this);
          }).call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          );
        },
        { "@mapbox/fusspot": 7, xtend: 40 },
      ],
      26: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            if (a[t]) return a[t];
            var e = t.split("."),
              n = e[0],
              r = e[1];
            if (!r) throw new Error("Invalid token");
            var s = i(r),
              u = { usage: n, user: s.u };
            return (
              o(s, "a") && (u.authorization = s.a),
              o(s, "exp") && (u.expires = 1e3 * s.exp),
              o(s, "iat") && (u.created = 1e3 * s.iat),
              o(s, "scopes") && (u.scopes = s.scopes),
              o(s, "client") && (u.client = s.client),
              o(s, "ll") && (u.lastLogin = s.ll),
              o(s, "iu") && (u.impersonator = s.iu),
              (a[t] = u),
              u
            );
          }
          function i(t) {
            try {
              return JSON.parse(s.decode(t));
            } catch (t) {
              throw new Error("Invalid token");
            }
          }
          function o(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
          }
          var s = t("base-64"),
            a = {};
          e.exports = r;
        },
        { "base-64": 27 },
      ],
      27: [
        function (e, n, r) {
          (function (e) {
            (function () {
              "use strict";
              function i(t) {
                "@babel/helpers - typeof";
                return (i =
                  "function" == typeof Symbol &&
                  "symbol" == typeof Symbol.iterator
                    ? function (t) {
                        return typeof t;
                      }
                    : function (t) {
                        return t &&
                          "function" == typeof Symbol &&
                          t.constructor === Symbol &&
                          t !== Symbol.prototype
                          ? "symbol"
                          : typeof t;
                      })(t);
              }
              !(function (o) {
                var s = "object" == (void 0 === r ? "undefined" : i(r)) && r,
                  a =
                    "object" == (void 0 === n ? "undefined" : i(n)) &&
                    n &&
                    n.exports == s &&
                    n,
                  u = "object" == (void 0 === e ? "undefined" : i(e)) && e;
                (u.global !== u && u.window !== u) || (o = u);
                var c = function (t) {
                  this.message = t;
                };
                (c.prototype = new Error()),
                  (c.prototype.name = "InvalidCharacterError");
                var l = function (t) {
                    throw new c(t);
                  },
                  h =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                  p = /[\t\n\f\r ]/g,
                  d = function (t) {
                    t = String(t).replace(p, "");
                    var e = t.length;
                    e % 4 == 0 && ((t = t.replace(/==?$/, "")), (e = t.length)),
                      (e % 4 == 1 || /[^+a-zA-Z0-9/]/.test(t)) &&
                        l(
                          "Invalid character: the string to be decoded is not correctly encoded."
                        );
                    for (var n, r, i = 0, o = "", s = -1; ++s < e; )
                      (r = h.indexOf(t.charAt(s))),
                        (n = i % 4 ? 64 * n + r : r),
                        i++ % 4 &&
                          (o += String.fromCharCode(
                            255 & (n >> ((-2 * i) & 6))
                          ));
                    return o;
                  },
                  f = function (t) {
                    (t = String(t)),
                      /[^\0-\xFF]/.test(t) &&
                        l(
                          "The string to be encoded contains characters outside of the Latin1 range."
                        );
                    for (
                      var e,
                        n,
                        r,
                        i,
                        o = t.length % 3,
                        s = "",
                        a = -1,
                        u = t.length - o;
                      ++a < u;

                    )
                      (e = t.charCodeAt(a) << 16),
                        (n = t.charCodeAt(++a) << 8),
                        (r = t.charCodeAt(++a)),
                        (i = e + n + r),
                        (s +=
                          h.charAt((i >> 18) & 63) +
                          h.charAt((i >> 12) & 63) +
                          h.charAt((i >> 6) & 63) +
                          h.charAt(63 & i));
                    return (
                      2 == o
                        ? ((e = t.charCodeAt(a) << 8),
                          (n = t.charCodeAt(++a)),
                          (i = e + n),
                          (s +=
                            h.charAt(i >> 10) +
                            h.charAt((i >> 4) & 63) +
                            h.charAt((i << 2) & 63) +
                            "="))
                        : 1 == o &&
                          ((i = t.charCodeAt(a)),
                          (s +=
                            h.charAt(i >> 2) + h.charAt((i << 4) & 63) + "==")),
                      s
                    );
                  },
                  m = { encode: f, decode: d, version: "0.1.0" };
                if ("function" == typeof t && "object" == i(t.amd) && t.amd)
                  t(function () {
                    return m;
                  });
                else if (s && !s.nodeType)
                  if (a) a.exports = m;
                  else for (var g in m) m.hasOwnProperty(g) && (s[g] = m[g]);
                else o.base64 = m;
              })(void 0);
            }).call(this);
          }).call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          );
        },
        {},
      ],
      28: [
        function (t, e, n) {
          "use strict";
          function r(t) {
            "@babel/helpers - typeof";
            return (r =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      "function" == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? "symbol"
                      : typeof t;
                  })(t);
          }
          function i() {
            (this._events &&
              Object.prototype.hasOwnProperty.call(this, "_events")) ||
              ((this._events = x(null)), (this._eventsCount = 0)),
              (this._maxListeners = this._maxListeners || void 0);
          }
          function o(t) {
            return void 0 === t._maxListeners
              ? i.defaultMaxListeners
              : t._maxListeners;
          }
          function s(t, e, n) {
            if (e) t.call(n);
            else
              for (var r = t.length, i = y(t, r), o = 0; o < r; ++o)
                i[o].call(n);
          }
          function a(t, e, n, r) {
            if (e) t.call(n, r);
            else
              for (var i = t.length, o = y(t, i), s = 0; s < i; ++s)
                o[s].call(n, r);
          }
          function u(t, e, n, r, i) {
            if (e) t.call(n, r, i);
            else
              for (var o = t.length, s = y(t, o), a = 0; a < o; ++a)
                s[a].call(n, r, i);
          }
          function c(t, e, n, r, i, o) {
            if (e) t.call(n, r, i, o);
            else
              for (var s = t.length, a = y(t, s), u = 0; u < s; ++u)
                a[u].call(n, r, i, o);
          }
          function l(t, e, n, r) {
            if (e) t.apply(n, r);
            else
              for (var i = t.length, o = y(t, i), s = 0; s < i; ++s)
                o[s].apply(n, r);
          }
          function h(t, e, n, i) {
            var s, a, u;
            if ("function" != typeof n)
              throw new TypeError('"listener" argument must be a function');
            if (
              ((a = t._events),
              a
                ? (a.newListener &&
                    (t.emit("newListener", e, n.listener ? n.listener : n),
                    (a = t._events)),
                  (u = a[e]))
                : ((a = t._events = x(null)), (t._eventsCount = 0)),
              u)
            ) {
              if (
                ("function" == typeof u
                  ? (u = a[e] = i ? [n, u] : [u, n])
                  : i
                  ? u.unshift(n)
                  : u.push(n),
                !u.warned && (s = o(t)) && s > 0 && u.length > s)
              ) {
                u.warned = !0;
                var c = new Error(
                  "Possible EventEmitter memory leak detected. " +
                    u.length +
                    ' "' +
                    String(e) +
                    '" listeners added. Use emitter.setMaxListeners() to increase limit.'
                );
                (c.name = "MaxListenersExceededWarning"),
                  (c.emitter = t),
                  (c.type = e),
                  (c.count = u.length),
                  "object" ===
                    ("undefined" == typeof console
                      ? "undefined"
                      : r(console)) &&
                    console.warn &&
                    console.warn("%s: %s", c.name, c.message);
              }
            } else (u = a[e] = n), ++t._eventsCount;
            return t;
          }
          function p() {
            if (!this.fired)
              switch (
                (this.target.removeListener(this.type, this.wrapFn),
                (this.fired = !0),
                arguments.length)
              ) {
                case 0:
                  return this.listener.call(this.target);
                case 1:
                  return this.listener.call(this.target, arguments[0]);
                case 2:
                  return this.listener.call(
                    this.target,
                    arguments[0],
                    arguments[1]
                  );
                case 3:
                  return this.listener.call(
                    this.target,
                    arguments[0],
                    arguments[1],
                    arguments[2]
                  );
                default:
                  for (
                    var t = new Array(arguments.length), e = 0;
                    e < t.length;
                    ++e
                  )
                    t[e] = arguments[e];
                  this.listener.apply(this.target, t);
              }
          }
          function d(t, e, n) {
            var r = {
                fired: !1,
                wrapFn: void 0,
                target: t,
                type: e,
                listener: n,
              },
              i = O.call(p, r);
            return (i.listener = n), (r.wrapFn = i), i;
          }
          function f(t, e, n) {
            var r = t._events;
            if (!r) return [];
            var i = r[e];
            return i
              ? "function" == typeof i
                ? n
                  ? [i.listener || i]
                  : [i]
                : n
                ? v(i)
                : y(i, i.length)
              : [];
          }
          function m(t) {
            var e = this._events;
            if (e) {
              var n = e[t];
              if ("function" == typeof n) return 1;
              if (n) return n.length;
            }
            return 0;
          }
          function g(t, e) {
            for (var n = e, r = n + 1, i = t.length; r < i; n += 1, r += 1)
              t[n] = t[r];
            t.pop();
          }
          function y(t, e) {
            for (var n = new Array(e), r = 0; r < e; ++r) n[r] = t[r];
            return n;
          }
          function v(t) {
            for (var e = new Array(t.length), n = 0; n < e.length; ++n)
              e[n] = t[n].listener || t[n];
            return e;
          }
          function b(t) {
            var e = function () {};
            return (e.prototype = t), new e();
          }
          function _(t) {
            var e = [];
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && e.push(n);
            return n;
          }
          function w(t) {
            var e = this;
            return function () {
              return e.apply(t, arguments);
            };
          }
          var x = Object.create || b,
            E = Object.keys || _,
            O = Function.prototype.bind || w;
          (e.exports = i),
            (i.EventEmitter = i),
            (i.prototype._events = void 0),
            (i.prototype._maxListeners = void 0);
          var L,
            k = 10;
          try {
            var A = {};
            Object.defineProperty &&
              Object.defineProperty(A, "x", { value: 0 }),
              (L = 0 === A.x);
          } catch (t) {
            L = !1;
          }
          L
            ? Object.defineProperty(i, "defaultMaxListeners", {
                enumerable: !0,
                get: function () {
                  return k;
                },
                set: function (t) {
                  if ("number" != typeof t || t < 0 || t !== t)
                    throw new TypeError(
                      '"defaultMaxListeners" must be a positive number'
                    );
                  k = t;
                },
              })
            : (i.defaultMaxListeners = k),
            (i.prototype.setMaxListeners = function (t) {
              if ("number" != typeof t || t < 0 || isNaN(t))
                throw new TypeError('"n" argument must be a positive number');
              return (this._maxListeners = t), this;
            }),
            (i.prototype.getMaxListeners = function () {
              return o(this);
            }),
            (i.prototype.emit = function (t) {
              var e,
                n,
                r,
                i,
                o,
                h,
                p = "error" === t;
              if ((h = this._events)) p = p && null == h.error;
              else if (!p) return !1;
              if (p) {
                if (
                  (arguments.length > 1 && (e = arguments[1]),
                  e instanceof Error)
                )
                  throw e;
                var d = new Error('Unhandled "error" event. (' + e + ")");
                throw ((d.context = e), d);
              }
              if (!(n = h[t])) return !1;
              var f = "function" == typeof n;
              switch ((r = arguments.length)) {
                case 1:
                  s(n, f, this);
                  break;
                case 2:
                  a(n, f, this, arguments[1]);
                  break;
                case 3:
                  u(n, f, this, arguments[1], arguments[2]);
                  break;
                case 4:
                  c(n, f, this, arguments[1], arguments[2], arguments[3]);
                  break;
                default:
                  for (i = new Array(r - 1), o = 1; o < r; o++)
                    i[o - 1] = arguments[o];
                  l(n, f, this, i);
              }
              return !0;
            }),
            (i.prototype.addListener = function (t, e) {
              return h(this, t, e, !1);
            }),
            (i.prototype.on = i.prototype.addListener),
            (i.prototype.prependListener = function (t, e) {
              return h(this, t, e, !0);
            }),
            (i.prototype.once = function (t, e) {
              if ("function" != typeof e)
                throw new TypeError('"listener" argument must be a function');
              return this.on(t, d(this, t, e)), this;
            }),
            (i.prototype.prependOnceListener = function (t, e) {
              if ("function" != typeof e)
                throw new TypeError('"listener" argument must be a function');
              return this.prependListener(t, d(this, t, e)), this;
            }),
            (i.prototype.removeListener = function (t, e) {
              var n, r, i, o, s;
              if ("function" != typeof e)
                throw new TypeError('"listener" argument must be a function');
              if (!(r = this._events)) return this;
              if (!(n = r[t])) return this;
              if (n === e || n.listener === e)
                0 == --this._eventsCount
                  ? (this._events = x(null))
                  : (delete r[t],
                    r.removeListener &&
                      this.emit("removeListener", t, n.listener || e));
              else if ("function" != typeof n) {
                for (i = -1, o = n.length - 1; o >= 0; o--)
                  if (n[o] === e || n[o].listener === e) {
                    (s = n[o].listener), (i = o);
                    break;
                  }
                if (i < 0) return this;
                0 === i ? n.shift() : g(n, i),
                  1 === n.length && (r[t] = n[0]),
                  r.removeListener && this.emit("removeListener", t, s || e);
              }
              return this;
            }),
            (i.prototype.removeAllListeners = function (t) {
              var e, n, r;
              if (!(n = this._events)) return this;
              if (!n.removeListener)
                return (
                  0 === arguments.length
                    ? ((this._events = x(null)), (this._eventsCount = 0))
                    : n[t] &&
                      (0 == --this._eventsCount
                        ? (this._events = x(null))
                        : delete n[t]),
                  this
                );
              if (0 === arguments.length) {
                var i,
                  o = E(n);
                for (r = 0; r < o.length; ++r)
                  "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
                return (
                  this.removeAllListeners("removeListener"),
                  (this._events = x(null)),
                  (this._eventsCount = 0),
                  this
                );
              }
              if ("function" == typeof (e = n[t])) this.removeListener(t, e);
              else if (e)
                for (r = e.length - 1; r >= 0; r--)
                  this.removeListener(t, e[r]);
              return this;
            }),
            (i.prototype.listeners = function (t) {
              return f(this, t, !0);
            }),
            (i.prototype.rawListeners = function (t) {
              return f(this, t, !1);
            }),
            (i.listenerCount = function (t, e) {
              return "function" == typeof t.listenerCount
                ? t.listenerCount(e)
                : m.call(t, e);
            }),
            (i.prototype.listenerCount = m),
            (i.prototype.eventNames = function () {
              return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
            });
        },
        {},
      ],
      29: [
        function (t, e, n) {
          "use strict";
          function r() {}
          function i(t, e, n) {
            (this.fn = t), (this.context = e), (this.once = n || !1);
          }
          function o(t, e, n, r, o) {
            if ("function" != typeof n)
              throw new TypeError("The listener must be a function");
            var s = new i(n, r || t, o),
              a = c ? c + e : e;
            return (
              t._events[a]
                ? t._events[a].fn
                  ? (t._events[a] = [t._events[a], s])
                  : t._events[a].push(s)
                : ((t._events[a] = s), t._eventsCount++),
              t
            );
          }
          function s(t, e) {
            0 == --t._eventsCount ? (t._events = new r()) : delete t._events[e];
          }
          function a() {
            (this._events = new r()), (this._eventsCount = 0);
          }
          var u = Object.prototype.hasOwnProperty,
            c = "~";
          Object.create &&
            ((r.prototype = Object.create(null)),
            new r().__proto__ || (c = !1)),
            (a.prototype.eventNames = function () {
              var t,
                e,
                n = [];
              if (0 === this._eventsCount) return n;
              for (e in (t = this._events))
                u.call(t, e) && n.push(c ? e.slice(1) : e);
              return Object.getOwnPropertySymbols
                ? n.concat(Object.getOwnPropertySymbols(t))
                : n;
            }),
            (a.prototype.listeners = function (t) {
              var e = c ? c + t : t,
                n = this._events[e];
              if (!n) return [];
              if (n.fn) return [n.fn];
              for (var r = 0, i = n.length, o = new Array(i); r < i; r++)
                o[r] = n[r].fn;
              return o;
            }),
            (a.prototype.listenerCount = function (t) {
              var e = c ? c + t : t,
                n = this._events[e];
              return n ? (n.fn ? 1 : n.length) : 0;
            }),
            (a.prototype.emit = function (t, e, n, r, i, o) {
              var s = c ? c + t : t;
              if (!this._events[s]) return !1;
              var a,
                u,
                l = this._events[s],
                h = arguments.length;
              if (l.fn) {
                switch (
                  (l.once && this.removeListener(t, l.fn, void 0, !0), h)
                ) {
                  case 1:
                    return l.fn.call(l.context), !0;
                  case 2:
                    return l.fn.call(l.context, e), !0;
                  case 3:
                    return l.fn.call(l.context, e, n), !0;
                  case 4:
                    return l.fn.call(l.context, e, n, r), !0;
                  case 5:
                    return l.fn.call(l.context, e, n, r, i), !0;
                  case 6:
                    return l.fn.call(l.context, e, n, r, i, o), !0;
                }
                for (u = 1, a = new Array(h - 1); u < h; u++)
                  a[u - 1] = arguments[u];
                l.fn.apply(l.context, a);
              } else {
                var p,
                  d = l.length;
                for (u = 0; u < d; u++)
                  switch (
                    (l[u].once && this.removeListener(t, l[u].fn, void 0, !0),
                    h)
                  ) {
                    case 1:
                      l[u].fn.call(l[u].context);
                      break;
                    case 2:
                      l[u].fn.call(l[u].context, e);
                      break;
                    case 3:
                      l[u].fn.call(l[u].context, e, n);
                      break;
                    case 4:
                      l[u].fn.call(l[u].context, e, n, r);
                      break;
                    default:
                      if (!a)
                        for (p = 1, a = new Array(h - 1); p < h; p++)
                          a[p - 1] = arguments[p];
                      l[u].fn.apply(l[u].context, a);
                  }
              }
              return !0;
            }),
            (a.prototype.on = function (t, e, n) {
              return o(this, t, e, n, !1);
            }),
            (a.prototype.once = function (t, e, n) {
              return o(this, t, e, n, !0);
            }),
            (a.prototype.removeListener = function (t, e, n, r) {
              var i = c ? c + t : t;
              if (!this._events[i]) return this;
              if (!e) return s(this, i), this;
              var o = this._events[i];
              if (o.fn)
                o.fn !== e ||
                  (r && !o.once) ||
                  (n && o.context !== n) ||
                  s(this, i);
              else {
                for (var a = 0, u = [], l = o.length; a < l; a++)
                  (o[a].fn !== e ||
                    (r && !o[a].once) ||
                    (n && o[a].context !== n)) &&
                    u.push(o[a]);
                u.length
                  ? (this._events[i] = 1 === u.length ? u[0] : u)
                  : s(this, i);
              }
              return this;
            }),
            (a.prototype.removeAllListeners = function (t) {
              var e;
              return (
                t
                  ? ((e = c ? c + t : t), this._events[e] && s(this, e))
                  : ((this._events = new r()), (this._eventsCount = 0)),
                this
              );
            }),
            (a.prototype.off = a.prototype.removeListener),
            (a.prototype.addListener = a.prototype.on),
            (a.prefixed = c),
            (a.EventEmitter = a),
            void 0 !== e && (e.exports = a);
        },
        {},
      ],
      30: [
        function (t, e, n) {
          "use strict";
          !(function () {
            var t = this,
              r = {};
            void 0 !== n ? (e.exports = r) : (t.fuzzy = r),
              (r.simpleFilter = function (t, e) {
                return e.filter(function (e) {
                  return r.test(t, e);
                });
              }),
              (r.test = function (t, e) {
                return null !== r.match(t, e);
              }),
              (r.match = function (t, e, n) {
                n = n || {};
                var r,
                  i = 0,
                  o = [],
                  s = e.length,
                  a = 0,
                  u = 0,
                  c = n.pre || "",
                  l = n.post || "",
                  h = (n.caseSensitive && e) || e.toLowerCase();
                t = (n.caseSensitive && t) || t.toLowerCase();
                for (var p = 0; p < s; p++)
                  (r = e[p]),
                    h[p] === t[i]
                      ? ((r = c + r + l), (i += 1), (u += 1 + u))
                      : (u = 0),
                    (a += u),
                    (o[o.length] = r);
                return i === t.length
                  ? ((a = h === t ? 1 / 0 : a),
                    { rendered: o.join(""), score: a })
                  : null;
              }),
              (r.filter = function (t, e, n) {
                return e && 0 !== e.length
                  ? "string" != typeof t
                    ? e
                    : ((n = n || {}),
                      e
                        .reduce(function (e, i, o, s) {
                          var a = i;
                          n.extract && (a = n.extract(i));
                          var u = r.match(t, a, n);
                          return (
                            null != u &&
                              (e[e.length] = {
                                string: u.rendered,
                                score: u.score,
                                index: o,
                                original: i,
                              }),
                            e
                          );
                        }, [])
                        .sort(function (t, e) {
                          var n = e.score - t.score;
                          return n || t.index - e.index;
                        }))
                  : [];
              });
          })();
        },
        {},
      ],
      31: [
        function (t, e, n) {
          "use strict";
          var r = Object.prototype.toString;
          e.exports = function (t) {
            var e;
            return (
              "[object Object]" === r.call(t) &&
              (null === (e = Object.getPrototypeOf(t)) ||
                e === Object.getPrototypeOf({}))
            );
          };
        },
        {},
      ],
      32: [
        function (t, e, n) {
          (function (t) {
            (function () {
              "use strict";
              function n(t) {
                "@babel/helpers - typeof";
                return (n =
                  "function" == typeof Symbol &&
                  "symbol" == typeof Symbol.iterator
                    ? function (t) {
                        return typeof t;
                      }
                    : function (t) {
                        return t &&
                          "function" == typeof Symbol &&
                          t.constructor === Symbol &&
                          t !== Symbol.prototype
                          ? "symbol"
                          : typeof t;
                      })(t);
              }
              function r(t, e, n) {
                function r(e) {
                  var n = m,
                    r = g;
                  return (m = g = void 0), (O = e), (v = t.apply(r, n));
                }
                function o(t) {
                  return (O = t), (b = setTimeout(l, e)), L ? r(t) : v;
                }
                function s(t) {
                  var n = t - _,
                    r = t - O,
                    i = e - n;
                  return k ? x(i, y - r) : i;
                }
                function c(t) {
                  var n = t - _,
                    r = t - O;
                  return void 0 === _ || n >= e || n < 0 || (k && r >= y);
                }
                function l() {
                  var t = E();
                  if (c(t)) return h(t);
                  b = setTimeout(l, s(t));
                }
                function h(t) {
                  return (b = void 0), A && m ? r(t) : ((m = g = void 0), v);
                }
                function p() {
                  void 0 !== b && clearTimeout(b),
                    (O = 0),
                    (m = _ = g = b = void 0);
                }
                function d() {
                  return void 0 === b ? v : h(E());
                }
                function f() {
                  var t = E(),
                    n = c(t);
                  if (((m = arguments), (g = this), (_ = t), n)) {
                    if (void 0 === b) return o(_);
                    if (k) return (b = setTimeout(l, e)), r(_);
                  }
                  return void 0 === b && (b = setTimeout(l, e)), v;
                }
                var m,
                  g,
                  y,
                  v,
                  b,
                  _,
                  O = 0,
                  L = !1,
                  k = !1,
                  A = !0;
                if ("function" != typeof t) throw new TypeError(u);
                return (
                  (e = a(e) || 0),
                  i(n) &&
                    ((L = !!n.leading),
                    (k = "maxWait" in n),
                    (y = k ? w(a(n.maxWait) || 0, e) : y),
                    (A = "trailing" in n ? !!n.trailing : A)),
                  (f.cancel = p),
                  (f.flush = d),
                  f
                );
              }
              function i(t) {
                var e = n(t);
                return !!t && ("object" == e || "function" == e);
              }
              function o(t) {
                return !!t && "object" == n(t);
              }
              function s(t) {
                return "symbol" == n(t) || (o(t) && _.call(t) == l);
              }
              function a(t) {
                if ("number" == typeof t) return t;
                if (s(t)) return c;
                if (i(t)) {
                  var e = "function" == typeof t.valueOf ? t.valueOf() : t;
                  t = i(e) ? e + "" : e;
                }
                if ("string" != typeof t) return 0 === t ? t : +t;
                t = t.replace(h, "");
                var n = d.test(t);
                return n || f.test(t)
                  ? m(t.slice(2), n ? 2 : 8)
                  : p.test(t)
                  ? c
                  : +t;
              }
              var u = "Expected a function",
                c = NaN,
                l = "[object Symbol]",
                h = /^\s+|\s+$/g,
                p = /^[-+]0x[0-9a-f]+$/i,
                d = /^0b[01]+$/i,
                f = /^0o[0-7]+$/i,
                m = parseInt,
                g =
                  "object" == (void 0 === t ? "undefined" : n(t)) &&
                  t &&
                  t.Object === Object &&
                  t,
                y =
                  "object" ==
                    ("undefined" == typeof self ? "undefined" : n(self)) &&
                  self &&
                  self.Object === Object &&
                  self,
                v = g || y || Function("return this")(),
                b = Object.prototype,
                _ = b.toString,
                w = Math.max,
                x = Math.min,
                E = function () {
                  return v.Date.now();
                };
              e.exports = r;
            }).call(this);
          }).call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          );
        },
        {},
      ],
      33: [
        function (t, e, n) {
          (function (n) {
            (function () {
              "use strict";
              var r = t("./url-alphabet/index.cjs"),
                i = r.urlAlphabet;
              if ("production" !== n.env.NODE_ENV) {
                if (
                  "undefined" != typeof navigator &&
                  "ReactNative" === navigator.product &&
                  "undefined" == typeof crypto
                )
                  throw new Error(
                    "React Native does not have a built-in secure random generator. If you don’t need unpredictable IDs use `nanoid/non-secure`. For secure IDs, import `react-native-get-random-values` before Nano ID."
                  );
                if (
                  "undefined" != typeof msCrypto &&
                  "undefined" == typeof crypto
                )
                  throw new Error(
                    "Import file with `if (!window.crypto) window.crypto = window.msCrypto` before importing Nano ID to fix IE 11 support"
                  );
                if ("undefined" == typeof crypto)
                  throw new Error(
                    "Your browser does not have secure random generator. If you don’t need unpredictable IDs, you can use nanoid/non-secure."
                  );
              }
              var o = function (t) {
                  return crypto.getRandomValues(new Uint8Array(t));
                },
                s = function (t, e, n) {
                  var r = (2 << (Math.log(t.length - 1) / Math.LN2)) - 1,
                    i = -~((1.6 * r * e) / t.length);
                  return function () {
                    for (var o = ""; ; )
                      for (var s = n(i), a = i; a--; )
                        if (((o += t[s[a] & r] || ""), o.length === e))
                          return o;
                  };
                },
                a = function (t, e) {
                  return s(t, e, o);
                },
                u = function () {
                  for (
                    var t =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : 21,
                      e = "",
                      n = crypto.getRandomValues(new Uint8Array(t));
                    t--;

                  ) {
                    var r = 63 & n[t];
                    e +=
                      r < 36
                        ? r.toString(36)
                        : r < 62
                        ? (r - 26).toString(36).toUpperCase()
                        : r < 63
                        ? "_"
                        : "-";
                  }
                  return e;
                };
              e.exports = {
                nanoid: u,
                customAlphabet: a,
                customRandom: s,
                urlAlphabet: i,
                random: o,
              };
            }).call(this);
          }).call(this, t("_process"));
        },
        { "./url-alphabet/index.cjs": 34, _process: 35 },
      ],
      34: [
        function (t, e, n) {
          "use strict";
          e.exports = {
            urlAlphabet:
              "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict",
          };
        },
        {},
      ],
      35: [
        function (t, e, n) {
          "use strict";
          function r() {
            throw new Error("setTimeout has not been defined");
          }
          function i() {
            throw new Error("clearTimeout has not been defined");
          }
          function o(t) {
            if (h === setTimeout) return setTimeout(t, 0);
            if ((h === r || !h) && setTimeout)
              return (h = setTimeout), setTimeout(t, 0);
            try {
              return h(t, 0);
            } catch (e) {
              try {
                return h.call(null, t, 0);
              } catch (e) {
                return h.call(this, t, 0);
              }
            }
          }
          function s(t) {
            if (p === clearTimeout) return clearTimeout(t);
            if ((p === i || !p) && clearTimeout)
              return (p = clearTimeout), clearTimeout(t);
            try {
              return p(t);
            } catch (e) {
              try {
                return p.call(null, t);
              } catch (e) {
                return p.call(this, t);
              }
            }
          }
          function a() {
            g &&
              f &&
              ((g = !1),
              f.length ? (m = f.concat(m)) : (y = -1),
              m.length && u());
          }
          function u() {
            if (!g) {
              var t = o(a);
              g = !0;
              for (var e = m.length; e; ) {
                for (f = m, m = []; ++y < e; ) f && f[y].run();
                (y = -1), (e = m.length);
              }
              (f = null), (g = !1), s(t);
            }
          }
          function c(t, e) {
            (this.fun = t), (this.array = e);
          }
          function l() {}
          var h,
            p,
            d = (e.exports = {});
          !(function () {
            try {
              h = "function" == typeof setTimeout ? setTimeout : r;
            } catch (t) {
              h = r;
            }
            try {
              p = "function" == typeof clearTimeout ? clearTimeout : i;
            } catch (t) {
              p = i;
            }
          })();
          var f,
            m = [],
            g = !1,
            y = -1;
          (d.nextTick = function (t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1)
              for (var n = 1; n < arguments.length; n++)
                e[n - 1] = arguments[n];
            m.push(new c(t, e)), 1 !== m.length || g || o(u);
          }),
            (c.prototype.run = function () {
              this.fun.apply(null, this.array);
            }),
            (d.title = "browser"),
            (d.browser = !0),
            (d.env = {}),
            (d.argv = []),
            (d.version = ""),
            (d.versions = {}),
            (d.on = l),
            (d.addListener = l),
            (d.once = l),
            (d.off = l),
            (d.removeListener = l),
            (d.removeAllListeners = l),
            (d.emit = l),
            (d.prependListener = l),
            (d.prependOnceListener = l),
            (d.listeners = function (t) {
              return [];
            }),
            (d.binding = function (t) {
              throw new Error("process.binding is not supported");
            }),
            (d.cwd = function () {
              return "/";
            }),
            (d.chdir = function (t) {
              throw new Error("process.chdir is not supported");
            }),
            (d.umask = function () {
              return 0;
            });
        },
        {},
      ],
      36: [
        function (t, e, n) {
          "use strict";
          !(function (t, n, r) {
            void 0 !== e && e.exports ? (e.exports = r()) : (t.subtag = r());
          })(void 0, 0, function () {
            function t(t) {
              return t.match(s) || [];
            }
            function e(e) {
              return t(e).filter(function (t, e) {
                return t && e;
              });
            }
            function n(e) {
              return (
                (e = t(e)),
                {
                  language: e[1] || o,
                  extlang: e[2] || o,
                  script: e[3] || o,
                  region: e[4] || o,
                }
              );
            }
            function r(t, e, n) {
              Object.defineProperty(t, e, { value: n, enumerable: !0 });
            }
            function i(e, i, s) {
              function a(n) {
                return t(n)[e] || o;
              }
              r(a, "pattern", i), r(n, s, a);
            }
            var o = "",
              s =
                /^([a-zA-Z]{2,3})(?:[_-]+([a-zA-Z]{3})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{4})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{2}|[0-9]{3})(?=$|[_-]+))?/;
            return (
              i(1, /^[a-zA-Z]{2,3}$/, "language"),
              i(2, /^[a-zA-Z]{3}$/, "extlang"),
              i(3, /^[a-zA-Z]{4}$/, "script"),
              i(4, /^[a-zA-Z]{2}$|^[0-9]{3}$/, "region"),
              r(n, "split", e),
              n
            );
          });
        },
        {},
      ],
      37: [
        function (t, e, n) {
          "use strict";
          var r = t("./src/suggestions");
          (e.exports = r),
            "undefined" != typeof window && (window.Suggestions = r);
        },
        { "./src/suggestions": 39 },
      ],
      38: [
        function (t, e, n) {
          "use strict";
          var r = function (t) {
            return (
              (this.component = t),
              (this.items = []),
              (this.active = 0),
              (this.wrapper = document.createElement("div")),
              (this.wrapper.className = "suggestions-wrapper"),
              (this.element = document.createElement("ul")),
              (this.element.className = "suggestions"),
              this.wrapper.appendChild(this.element),
              (this.selectingListItem = !1),
              t.el.parentNode.insertBefore(this.wrapper, t.el.nextSibling),
              this
            );
          };
          (r.prototype.show = function () {
            this.element.style.display = "block";
          }),
            (r.prototype.hide = function () {
              this.element.style.display = "none";
            }),
            (r.prototype.add = function (t) {
              this.items.push(t);
            }),
            (r.prototype.clear = function () {
              (this.items = []), (this.active = 0);
            }),
            (r.prototype.isEmpty = function () {
              return !this.items.length;
            }),
            (r.prototype.isVisible = function () {
              return "block" === this.element.style.display;
            }),
            (r.prototype.draw = function () {
              if (((this.element.innerHTML = ""), 0 === this.items.length))
                return void this.hide();
              for (var t = 0; t < this.items.length; t++)
                this.drawItem(this.items[t], this.active === t);
              this.show();
            }),
            (r.prototype.drawItem = function (t, e) {
              var n = document.createElement("li"),
                r = document.createElement("a");
              e && (n.className += " active"),
                (r.innerHTML = t.string),
                n.appendChild(r),
                this.element.appendChild(n),
                n.addEventListener(
                  "mousedown",
                  function () {
                    this.selectingListItem = !0;
                  }.bind(this)
                ),
                n.addEventListener(
                  "mouseup",
                  function () {
                    this.handleMouseUp.call(this, t);
                  }.bind(this)
                );
            }),
            (r.prototype.handleMouseUp = function (t) {
              (this.selectingListItem = !1),
                this.component.value(t.original),
                this.clear(),
                this.draw();
            }),
            (r.prototype.move = function (t) {
              (this.active = t), this.draw();
            }),
            (r.prototype.previous = function () {
              this.move(
                0 === this.active ? this.items.length - 1 : this.active - 1
              );
            }),
            (r.prototype.next = function () {
              this.move(
                this.active === this.items.length - 1 ? 0 : this.active + 1
              );
            }),
            (r.prototype.drawError = function (t) {
              var e = document.createElement("li");
              (e.innerHTML = t), this.element.appendChild(e), this.show();
            }),
            (e.exports = r);
        },
        {},
      ],
      39: [
        function (t, e, n) {
          "use strict";
          var r = t("xtend"),
            i = t("fuzzy"),
            o = t("./list"),
            s = function (t, e, n) {
              return (
                (n = n || {}),
                (this.options = r(
                  { minLength: 2, limit: 5, filter: !0, hideOnBlur: !0 },
                  n
                )),
                (this.el = t),
                (this.data = e || []),
                (this.list = new o(this)),
                (this.query = ""),
                (this.selected = null),
                this.list.draw(),
                this.el.addEventListener(
                  "keyup",
                  function (t) {
                    this.handleKeyUp(t.keyCode);
                  }.bind(this),
                  !1
                ),
                this.el.addEventListener(
                  "keydown",
                  function (t) {
                    this.handleKeyDown(t);
                  }.bind(this)
                ),
                this.el.addEventListener(
                  "focus",
                  function () {
                    this.handleFocus();
                  }.bind(this)
                ),
                this.el.addEventListener(
                  "blur",
                  function () {
                    this.handleBlur();
                  }.bind(this)
                ),
                this.el.addEventListener(
                  "paste",
                  function (t) {
                    this.handlePaste(t);
                  }.bind(this)
                ),
                (this.render = this.options.render
                  ? this.options.render.bind(this)
                  : this.render.bind(this)),
                (this.getItemValue = this.options.getItemValue
                  ? this.options.getItemValue.bind(this)
                  : this.getItemValue.bind(this)),
                this
              );
            };
          (s.prototype.handleKeyUp = function (t) {
            40 !== t &&
              38 !== t &&
              27 !== t &&
              13 !== t &&
              9 !== t &&
              this.handleInputChange(this.el.value);
          }),
            (s.prototype.handleKeyDown = function (t) {
              switch (t.keyCode) {
                case 13:
                case 9:
                  this.list.isEmpty() ||
                    (this.list.isVisible() && t.preventDefault(),
                    this.value(this.list.items[this.list.active].original),
                    this.list.hide());
                  break;
                case 27:
                  this.list.isEmpty() || this.list.hide();
                  break;
                case 38:
                  this.list.previous();
                  break;
                case 40:
                  this.list.next();
              }
            }),
            (s.prototype.handleBlur = function () {
              !this.list.selectingListItem &&
                this.options.hideOnBlur &&
                this.list.hide();
            }),
            (s.prototype.handlePaste = function (t) {
              if (t.clipboardData)
                this.handleInputChange(t.clipboardData.getData("Text"));
              else {
                var e = this;
                setTimeout(function () {
                  e.handleInputChange(t.target.value);
                }, 100);
              }
            }),
            (s.prototype.handleInputChange = function (t) {
              if (
                ((this.query = this.normalize(t)),
                this.list.clear(),
                this.query.length < this.options.minLength)
              )
                return void this.list.draw();
              this.getCandidates(
                function (t) {
                  for (
                    var e = 0;
                    e < t.length &&
                    (this.list.add(t[e]), e !== this.options.limit - 1);
                    e++
                  );
                  this.list.draw();
                }.bind(this)
              );
            }),
            (s.prototype.handleFocus = function () {
              this.list.isEmpty() || this.list.show(),
                (this.list.selectingListItem = !1);
            }),
            (s.prototype.update = function (t) {
              (this.data = t), this.handleKeyUp();
            }),
            (s.prototype.clear = function () {
              (this.data = []), this.list.clear();
            }),
            (s.prototype.normalize = function (t) {
              return (t = t.toLowerCase());
            }),
            (s.prototype.match = function (t, e) {
              return t.indexOf(e) > -1;
            }),
            (s.prototype.value = function (t) {
              if (
                ((this.selected = t),
                (this.el.value = this.getItemValue(t)),
                document.createEvent)
              ) {
                var e = document.createEvent("HTMLEvents");
                e.initEvent("change", !0, !1), this.el.dispatchEvent(e);
              } else this.el.fireEvent("onchange");
            }),
            (s.prototype.getCandidates = function (t) {
              var e,
                n = {
                  pre: "<strong>",
                  post: "</strong>",
                  extract: function (t) {
                    return this.getItemValue(t);
                  }.bind(this),
                };
              this.options.filter
                ? ((e = i.filter(this.query, this.data, n)),
                  (e = e.map(
                    function (t) {
                      return {
                        original: t.original,
                        string: this.render(t.original, t.string),
                      };
                    }.bind(this)
                  )))
                : (e = this.data.map(
                    function (t) {
                      return { original: t, string: this.render(t) };
                    }.bind(this)
                  )),
                t(e);
            }),
            (s.prototype.getItemValue = function (t) {
              return t;
            }),
            (s.prototype.render = function (t, e) {
              if (e) return e;
              for (
                var n = t.original
                    ? this.getItemValue(t.original)
                    : this.getItemValue(t),
                  r = this.normalize(n),
                  i = r.lastIndexOf(this.query);
                i > -1;

              ) {
                var o = i + this.query.length;
                (n =
                  n.slice(0, i) +
                  "<strong>" +
                  n.slice(i, o) +
                  "</strong>" +
                  n.slice(o)),
                  (i = r.slice(0, i).lastIndexOf(this.query));
              }
              return n;
            }),
            (s.prototype.renderError = function (t) {
              this.list.drawError(t);
            }),
            (e.exports = s);
        },
        { "./list": 38, fuzzy: 30, xtend: 40 },
      ],
      40: [
        function (t, e, n) {
          "use strict";
          function r() {
            for (var t = {}, e = 0; e < arguments.length; e++) {
              var n = arguments[e];
              for (var r in n) i.call(n, r) && (t[r] = n[r]);
            }
            return t;
          }
          e.exports = r;
          var i = Object.prototype.hasOwnProperty;
        },
        {},
      ],
    },
    {},
    [4]
  )(4);
});
