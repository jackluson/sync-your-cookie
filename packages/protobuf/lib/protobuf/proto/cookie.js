/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const Cookie = $root.Cookie = (() => {

    /**
     * Properties of a Cookie.
     * @exports ICookie
     * @interface ICookie
     * @property {string|null} [domain] Cookie domain
     * @property {string|null} [name] Cookie name
     * @property {string|null} [storeId] Cookie storeId
     * @property {string|null} [value] Cookie value
     * @property {boolean|null} [session] Cookie session
     * @property {boolean|null} [hostOnly] Cookie hostOnly
     * @property {number|null} [expirationDate] Cookie expirationDate
     * @property {string|null} [path] Cookie path
     * @property {boolean|null} [httpOnly] Cookie httpOnly
     * @property {boolean|null} [secure] Cookie secure
     * @property {string|null} [sameSite] Cookie sameSite
     */

    /**
     * Constructs a new Cookie.
     * @exports Cookie
     * @classdesc Represents a Cookie.
     * @implements ICookie
     * @constructor
     * @param {ICookie=} [properties] Properties to set
     */
    function Cookie(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Cookie domain.
     * @member {string} domain
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.domain = "";

    /**
     * Cookie name.
     * @member {string} name
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.name = "";

    /**
     * Cookie storeId.
     * @member {string} storeId
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.storeId = "";

    /**
     * Cookie value.
     * @member {string} value
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.value = "";

    /**
     * Cookie session.
     * @member {boolean} session
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.session = false;

    /**
     * Cookie hostOnly.
     * @member {boolean} hostOnly
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.hostOnly = false;

    /**
     * Cookie expirationDate.
     * @member {number} expirationDate
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.expirationDate = 0;

    /**
     * Cookie path.
     * @member {string} path
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.path = "";

    /**
     * Cookie httpOnly.
     * @member {boolean} httpOnly
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.httpOnly = false;

    /**
     * Cookie secure.
     * @member {boolean} secure
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.secure = false;

    /**
     * Cookie sameSite.
     * @member {string} sameSite
     * @memberof Cookie
     * @instance
     */
    Cookie.prototype.sameSite = "";

    /**
     * Creates a new Cookie instance using the specified properties.
     * @function create
     * @memberof Cookie
     * @static
     * @param {ICookie=} [properties] Properties to set
     * @returns {Cookie} Cookie instance
     */
    Cookie.create = function create(properties) {
        return new Cookie(properties);
    };

    /**
     * Encodes the specified Cookie message. Does not implicitly {@link Cookie.verify|verify} messages.
     * @function encode
     * @memberof Cookie
     * @static
     * @param {ICookie} message Cookie message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Cookie.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.domain != null && Object.hasOwnProperty.call(message, "domain"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.domain);
        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.storeId != null && Object.hasOwnProperty.call(message, "storeId"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.storeId);
        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.value);
        if (message.session != null && Object.hasOwnProperty.call(message, "session"))
            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.session);
        if (message.hostOnly != null && Object.hasOwnProperty.call(message, "hostOnly"))
            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.hostOnly);
        if (message.expirationDate != null && Object.hasOwnProperty.call(message, "expirationDate"))
            writer.uint32(/* id 7, wireType 5 =*/61).float(message.expirationDate);
        if (message.path != null && Object.hasOwnProperty.call(message, "path"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.path);
        if (message.httpOnly != null && Object.hasOwnProperty.call(message, "httpOnly"))
            writer.uint32(/* id 9, wireType 0 =*/72).bool(message.httpOnly);
        if (message.secure != null && Object.hasOwnProperty.call(message, "secure"))
            writer.uint32(/* id 10, wireType 0 =*/80).bool(message.secure);
        if (message.sameSite != null && Object.hasOwnProperty.call(message, "sameSite"))
            writer.uint32(/* id 11, wireType 2 =*/90).string(message.sameSite);
        return writer;
    };

    /**
     * Encodes the specified Cookie message, length delimited. Does not implicitly {@link Cookie.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Cookie
     * @static
     * @param {ICookie} message Cookie message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Cookie.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Cookie message from the specified reader or buffer.
     * @function decode
     * @memberof Cookie
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Cookie} Cookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Cookie.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Cookie();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.domain = reader.string();
                    break;
                }
            case 2: {
                    message.name = reader.string();
                    break;
                }
            case 3: {
                    message.storeId = reader.string();
                    break;
                }
            case 4: {
                    message.value = reader.string();
                    break;
                }
            case 5: {
                    message.session = reader.bool();
                    break;
                }
            case 6: {
                    message.hostOnly = reader.bool();
                    break;
                }
            case 7: {
                    message.expirationDate = reader.float();
                    break;
                }
            case 8: {
                    message.path = reader.string();
                    break;
                }
            case 9: {
                    message.httpOnly = reader.bool();
                    break;
                }
            case 10: {
                    message.secure = reader.bool();
                    break;
                }
            case 11: {
                    message.sameSite = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Cookie message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Cookie
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Cookie} Cookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Cookie.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Cookie message.
     * @function verify
     * @memberof Cookie
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Cookie.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.domain != null && message.hasOwnProperty("domain"))
            if (!$util.isString(message.domain))
                return "domain: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.storeId != null && message.hasOwnProperty("storeId"))
            if (!$util.isString(message.storeId))
                return "storeId: string expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        if (message.session != null && message.hasOwnProperty("session"))
            if (typeof message.session !== "boolean")
                return "session: boolean expected";
        if (message.hostOnly != null && message.hasOwnProperty("hostOnly"))
            if (typeof message.hostOnly !== "boolean")
                return "hostOnly: boolean expected";
        if (message.expirationDate != null && message.hasOwnProperty("expirationDate"))
            if (typeof message.expirationDate !== "number")
                return "expirationDate: number expected";
        if (message.path != null && message.hasOwnProperty("path"))
            if (!$util.isString(message.path))
                return "path: string expected";
        if (message.httpOnly != null && message.hasOwnProperty("httpOnly"))
            if (typeof message.httpOnly !== "boolean")
                return "httpOnly: boolean expected";
        if (message.secure != null && message.hasOwnProperty("secure"))
            if (typeof message.secure !== "boolean")
                return "secure: boolean expected";
        if (message.sameSite != null && message.hasOwnProperty("sameSite"))
            if (!$util.isString(message.sameSite))
                return "sameSite: string expected";
        return null;
    };

    /**
     * Creates a Cookie message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Cookie
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Cookie} Cookie
     */
    Cookie.fromObject = function fromObject(object) {
        if (object instanceof $root.Cookie)
            return object;
        let message = new $root.Cookie();
        if (object.domain != null)
            message.domain = String(object.domain);
        if (object.name != null)
            message.name = String(object.name);
        if (object.storeId != null)
            message.storeId = String(object.storeId);
        if (object.value != null)
            message.value = String(object.value);
        if (object.session != null)
            message.session = Boolean(object.session);
        if (object.hostOnly != null)
            message.hostOnly = Boolean(object.hostOnly);
        if (object.expirationDate != null)
            message.expirationDate = Number(object.expirationDate);
        if (object.path != null)
            message.path = String(object.path);
        if (object.httpOnly != null)
            message.httpOnly = Boolean(object.httpOnly);
        if (object.secure != null)
            message.secure = Boolean(object.secure);
        if (object.sameSite != null)
            message.sameSite = String(object.sameSite);
        return message;
    };

    /**
     * Creates a plain object from a Cookie message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Cookie
     * @static
     * @param {Cookie} message Cookie
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Cookie.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.domain = "";
            object.name = "";
            object.storeId = "";
            object.value = "";
            object.session = false;
            object.hostOnly = false;
            object.expirationDate = 0;
            object.path = "";
            object.httpOnly = false;
            object.secure = false;
            object.sameSite = "";
        }
        if (message.domain != null && message.hasOwnProperty("domain"))
            object.domain = message.domain;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.storeId != null && message.hasOwnProperty("storeId"))
            object.storeId = message.storeId;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        if (message.session != null && message.hasOwnProperty("session"))
            object.session = message.session;
        if (message.hostOnly != null && message.hasOwnProperty("hostOnly"))
            object.hostOnly = message.hostOnly;
        if (message.expirationDate != null && message.hasOwnProperty("expirationDate"))
            object.expirationDate = options.json && !isFinite(message.expirationDate) ? String(message.expirationDate) : message.expirationDate;
        if (message.path != null && message.hasOwnProperty("path"))
            object.path = message.path;
        if (message.httpOnly != null && message.hasOwnProperty("httpOnly"))
            object.httpOnly = message.httpOnly;
        if (message.secure != null && message.hasOwnProperty("secure"))
            object.secure = message.secure;
        if (message.sameSite != null && message.hasOwnProperty("sameSite"))
            object.sameSite = message.sameSite;
        return object;
    };

    /**
     * Converts this Cookie to JSON.
     * @function toJSON
     * @memberof Cookie
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Cookie.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Cookie
     * @function getTypeUrl
     * @memberof Cookie
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Cookie.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Cookie";
    };

    return Cookie;
})();

export const DomainCookies = $root.DomainCookies = (() => {

    /**
     * Properties of a DomainCookies.
     * @exports IDomainCookies
     * @interface IDomainCookies
     * @property {number|Long|null} [timestamp] DomainCookies timestamp
     * @property {Array.<ICookie>|null} [cookies] DomainCookies cookies
     */

    /**
     * Constructs a new DomainCookies.
     * @exports DomainCookies
     * @classdesc Represents a DomainCookies.
     * @implements IDomainCookies
     * @constructor
     * @param {IDomainCookies=} [properties] Properties to set
     */
    function DomainCookies(properties) {
        this.cookies = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DomainCookies timestamp.
     * @member {number|Long} timestamp
     * @memberof DomainCookies
     * @instance
     */
    DomainCookies.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DomainCookies cookies.
     * @member {Array.<ICookie>} cookies
     * @memberof DomainCookies
     * @instance
     */
    DomainCookies.prototype.cookies = $util.emptyArray;

    /**
     * Creates a new DomainCookies instance using the specified properties.
     * @function create
     * @memberof DomainCookies
     * @static
     * @param {IDomainCookies=} [properties] Properties to set
     * @returns {DomainCookies} DomainCookies instance
     */
    DomainCookies.create = function create(properties) {
        return new DomainCookies(properties);
    };

    /**
     * Encodes the specified DomainCookies message. Does not implicitly {@link DomainCookies.verify|verify} messages.
     * @function encode
     * @memberof DomainCookies
     * @static
     * @param {IDomainCookies} message DomainCookies message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DomainCookies.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
        if (message.cookies != null && message.cookies.length)
            for (let i = 0; i < message.cookies.length; ++i)
                $root.Cookie.encode(message.cookies[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified DomainCookies message, length delimited. Does not implicitly {@link DomainCookies.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DomainCookies
     * @static
     * @param {IDomainCookies} message DomainCookies message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DomainCookies.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DomainCookies message from the specified reader or buffer.
     * @function decode
     * @memberof DomainCookies
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DomainCookies} DomainCookies
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DomainCookies.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.DomainCookies();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.timestamp = reader.int64();
                    break;
                }
            case 2: {
                    if (!(message.cookies && message.cookies.length))
                        message.cookies = [];
                    message.cookies.push($root.Cookie.decode(reader, reader.uint32()));
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DomainCookies message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DomainCookies
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DomainCookies} DomainCookies
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DomainCookies.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DomainCookies message.
     * @function verify
     * @memberof DomainCookies
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DomainCookies.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                return "timestamp: integer|Long expected";
        if (message.cookies != null && message.hasOwnProperty("cookies")) {
            if (!Array.isArray(message.cookies))
                return "cookies: array expected";
            for (let i = 0; i < message.cookies.length; ++i) {
                let error = $root.Cookie.verify(message.cookies[i]);
                if (error)
                    return "cookies." + error;
            }
        }
        return null;
    };

    /**
     * Creates a DomainCookies message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DomainCookies
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DomainCookies} DomainCookies
     */
    DomainCookies.fromObject = function fromObject(object) {
        if (object instanceof $root.DomainCookies)
            return object;
        let message = new $root.DomainCookies();
        if (object.timestamp != null)
            if ($util.Long)
                (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
            else if (typeof object.timestamp === "string")
                message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
                message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
                message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
        if (object.cookies) {
            if (!Array.isArray(object.cookies))
                throw TypeError(".DomainCookies.cookies: array expected");
            message.cookies = [];
            for (let i = 0; i < object.cookies.length; ++i) {
                if (typeof object.cookies[i] !== "object")
                    throw TypeError(".DomainCookies.cookies: object expected");
                message.cookies[i] = $root.Cookie.fromObject(object.cookies[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a DomainCookies message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DomainCookies
     * @static
     * @param {DomainCookies} message DomainCookies
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DomainCookies.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.cookies = [];
        if (options.defaults)
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.timestamp = options.longs === String ? "0" : 0;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
                object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
                object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
        if (message.cookies && message.cookies.length) {
            object.cookies = [];
            for (let j = 0; j < message.cookies.length; ++j)
                object.cookies[j] = $root.Cookie.toObject(message.cookies[j], options);
        }
        return object;
    };

    /**
     * Converts this DomainCookies to JSON.
     * @function toJSON
     * @memberof DomainCookies
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DomainCookies.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for DomainCookies
     * @function getTypeUrl
     * @memberof DomainCookies
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    DomainCookies.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/DomainCookies";
    };

    return DomainCookies;
})();

export { $root as default };
