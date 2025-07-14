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

export const DomainCookie = $root.DomainCookie = (() => {

    /**
     * Properties of a DomainCookie.
     * @exports IDomainCookie
     * @interface IDomainCookie
     * @property {number|Long|null} [createTime] DomainCookie createTime
     * @property {number|Long|null} [updateTime] DomainCookie updateTime
     * @property {Array.<ICookie>|null} [cookies] DomainCookie cookies
     */

    /**
     * Constructs a new DomainCookie.
     * @exports DomainCookie
     * @classdesc Represents a DomainCookie.
     * @implements IDomainCookie
     * @constructor
     * @param {IDomainCookie=} [properties] Properties to set
     */
    function DomainCookie(properties) {
        this.cookies = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DomainCookie createTime.
     * @member {number|Long} createTime
     * @memberof DomainCookie
     * @instance
     */
    DomainCookie.prototype.createTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DomainCookie updateTime.
     * @member {number|Long} updateTime
     * @memberof DomainCookie
     * @instance
     */
    DomainCookie.prototype.updateTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DomainCookie cookies.
     * @member {Array.<ICookie>} cookies
     * @memberof DomainCookie
     * @instance
     */
    DomainCookie.prototype.cookies = $util.emptyArray;

    /**
     * Creates a new DomainCookie instance using the specified properties.
     * @function create
     * @memberof DomainCookie
     * @static
     * @param {IDomainCookie=} [properties] Properties to set
     * @returns {DomainCookie} DomainCookie instance
     */
    DomainCookie.create = function create(properties) {
        return new DomainCookie(properties);
    };

    /**
     * Encodes the specified DomainCookie message. Does not implicitly {@link DomainCookie.verify|verify} messages.
     * @function encode
     * @memberof DomainCookie
     * @static
     * @param {IDomainCookie} message DomainCookie message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DomainCookie.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.createTime);
        if (message.updateTime != null && Object.hasOwnProperty.call(message, "updateTime"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.updateTime);
        if (message.cookies != null && message.cookies.length)
            for (let i = 0; i < message.cookies.length; ++i)
                $root.Cookie.encode(message.cookies[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified DomainCookie message, length delimited. Does not implicitly {@link DomainCookie.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DomainCookie
     * @static
     * @param {IDomainCookie} message DomainCookie message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DomainCookie.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DomainCookie message from the specified reader or buffer.
     * @function decode
     * @memberof DomainCookie
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DomainCookie} DomainCookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DomainCookie.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.DomainCookie();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.createTime = reader.int64();
                    break;
                }
            case 2: {
                    message.updateTime = reader.int64();
                    break;
                }
            case 5: {
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
     * Decodes a DomainCookie message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DomainCookie
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DomainCookie} DomainCookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DomainCookie.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DomainCookie message.
     * @function verify
     * @memberof DomainCookie
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DomainCookie.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (!$util.isInteger(message.createTime) && !(message.createTime && $util.isInteger(message.createTime.low) && $util.isInteger(message.createTime.high)))
                return "createTime: integer|Long expected";
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (!$util.isInteger(message.updateTime) && !(message.updateTime && $util.isInteger(message.updateTime.low) && $util.isInteger(message.updateTime.high)))
                return "updateTime: integer|Long expected";
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
     * Creates a DomainCookie message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DomainCookie
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DomainCookie} DomainCookie
     */
    DomainCookie.fromObject = function fromObject(object) {
        if (object instanceof $root.DomainCookie)
            return object;
        let message = new $root.DomainCookie();
        if (object.createTime != null)
            if ($util.Long)
                (message.createTime = $util.Long.fromValue(object.createTime)).unsigned = false;
            else if (typeof object.createTime === "string")
                message.createTime = parseInt(object.createTime, 10);
            else if (typeof object.createTime === "number")
                message.createTime = object.createTime;
            else if (typeof object.createTime === "object")
                message.createTime = new $util.LongBits(object.createTime.low >>> 0, object.createTime.high >>> 0).toNumber();
        if (object.updateTime != null)
            if ($util.Long)
                (message.updateTime = $util.Long.fromValue(object.updateTime)).unsigned = false;
            else if (typeof object.updateTime === "string")
                message.updateTime = parseInt(object.updateTime, 10);
            else if (typeof object.updateTime === "number")
                message.updateTime = object.updateTime;
            else if (typeof object.updateTime === "object")
                message.updateTime = new $util.LongBits(object.updateTime.low >>> 0, object.updateTime.high >>> 0).toNumber();
        if (object.cookies) {
            if (!Array.isArray(object.cookies))
                throw TypeError(".DomainCookie.cookies: array expected");
            message.cookies = [];
            for (let i = 0; i < object.cookies.length; ++i) {
                if (typeof object.cookies[i] !== "object")
                    throw TypeError(".DomainCookie.cookies: object expected");
                message.cookies[i] = $root.Cookie.fromObject(object.cookies[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a DomainCookie message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DomainCookie
     * @static
     * @param {DomainCookie} message DomainCookie
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DomainCookie.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.cookies = [];
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.createTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.createTime = options.longs === String ? "0" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.updateTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.updateTime = options.longs === String ? "0" : 0;
        }
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (typeof message.createTime === "number")
                object.createTime = options.longs === String ? String(message.createTime) : message.createTime;
            else
                object.createTime = options.longs === String ? $util.Long.prototype.toString.call(message.createTime) : options.longs === Number ? new $util.LongBits(message.createTime.low >>> 0, message.createTime.high >>> 0).toNumber() : message.createTime;
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (typeof message.updateTime === "number")
                object.updateTime = options.longs === String ? String(message.updateTime) : message.updateTime;
            else
                object.updateTime = options.longs === String ? $util.Long.prototype.toString.call(message.updateTime) : options.longs === Number ? new $util.LongBits(message.updateTime.low >>> 0, message.updateTime.high >>> 0).toNumber() : message.updateTime;
        if (message.cookies && message.cookies.length) {
            object.cookies = [];
            for (let j = 0; j < message.cookies.length; ++j)
                object.cookies[j] = $root.Cookie.toObject(message.cookies[j], options);
        }
        return object;
    };

    /**
     * Converts this DomainCookie to JSON.
     * @function toJSON
     * @memberof DomainCookie
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DomainCookie.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for DomainCookie
     * @function getTypeUrl
     * @memberof DomainCookie
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    DomainCookie.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/DomainCookie";
    };

    return DomainCookie;
})();

export const CookiesMap = $root.CookiesMap = (() => {

    /**
     * Properties of a CookiesMap.
     * @exports ICookiesMap
     * @interface ICookiesMap
     * @property {number|Long|null} [createTime] CookiesMap createTime
     * @property {number|Long|null} [updateTime] CookiesMap updateTime
     * @property {Object.<string,IDomainCookie>|null} [domainCookieMap] CookiesMap domainCookieMap
     */

    /**
     * Constructs a new CookiesMap.
     * @exports CookiesMap
     * @classdesc Represents a CookiesMap.
     * @implements ICookiesMap
     * @constructor
     * @param {ICookiesMap=} [properties] Properties to set
     */
    function CookiesMap(properties) {
        this.domainCookieMap = {};
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CookiesMap createTime.
     * @member {number|Long} createTime
     * @memberof CookiesMap
     * @instance
     */
    CookiesMap.prototype.createTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CookiesMap updateTime.
     * @member {number|Long} updateTime
     * @memberof CookiesMap
     * @instance
     */
    CookiesMap.prototype.updateTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CookiesMap domainCookieMap.
     * @member {Object.<string,IDomainCookie>} domainCookieMap
     * @memberof CookiesMap
     * @instance
     */
    CookiesMap.prototype.domainCookieMap = $util.emptyObject;

    /**
     * Creates a new CookiesMap instance using the specified properties.
     * @function create
     * @memberof CookiesMap
     * @static
     * @param {ICookiesMap=} [properties] Properties to set
     * @returns {CookiesMap} CookiesMap instance
     */
    CookiesMap.create = function create(properties) {
        return new CookiesMap(properties);
    };

    /**
     * Encodes the specified CookiesMap message. Does not implicitly {@link CookiesMap.verify|verify} messages.
     * @function encode
     * @memberof CookiesMap
     * @static
     * @param {ICookiesMap} message CookiesMap message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CookiesMap.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.createTime);
        if (message.updateTime != null && Object.hasOwnProperty.call(message, "updateTime"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.updateTime);
        if (message.domainCookieMap != null && Object.hasOwnProperty.call(message, "domainCookieMap"))
            for (let keys = Object.keys(message.domainCookieMap), i = 0; i < keys.length; ++i) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                $root.DomainCookie.encode(message.domainCookieMap[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
            }
        return writer;
    };

    /**
     * Encodes the specified CookiesMap message, length delimited. Does not implicitly {@link CookiesMap.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CookiesMap
     * @static
     * @param {ICookiesMap} message CookiesMap message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CookiesMap.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CookiesMap message from the specified reader or buffer.
     * @function decode
     * @memberof CookiesMap
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CookiesMap} CookiesMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CookiesMap.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CookiesMap(), key, value;
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.createTime = reader.int64();
                    break;
                }
            case 2: {
                    message.updateTime = reader.int64();
                    break;
                }
            case 5: {
                    if (message.domainCookieMap === $util.emptyObject)
                        message.domainCookieMap = {};
                    let end2 = reader.uint32() + reader.pos;
                    key = "";
                    value = null;
                    while (reader.pos < end2) {
                        let tag2 = reader.uint32();
                        switch (tag2 >>> 3) {
                        case 1:
                            key = reader.string();
                            break;
                        case 2:
                            value = $root.DomainCookie.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag2 & 7);
                            break;
                        }
                    }
                    message.domainCookieMap[key] = value;
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
     * Decodes a CookiesMap message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CookiesMap
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CookiesMap} CookiesMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CookiesMap.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CookiesMap message.
     * @function verify
     * @memberof CookiesMap
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CookiesMap.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (!$util.isInteger(message.createTime) && !(message.createTime && $util.isInteger(message.createTime.low) && $util.isInteger(message.createTime.high)))
                return "createTime: integer|Long expected";
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (!$util.isInteger(message.updateTime) && !(message.updateTime && $util.isInteger(message.updateTime.low) && $util.isInteger(message.updateTime.high)))
                return "updateTime: integer|Long expected";
        if (message.domainCookieMap != null && message.hasOwnProperty("domainCookieMap")) {
            if (!$util.isObject(message.domainCookieMap))
                return "domainCookieMap: object expected";
            let key = Object.keys(message.domainCookieMap);
            for (let i = 0; i < key.length; ++i) {
                let error = $root.DomainCookie.verify(message.domainCookieMap[key[i]]);
                if (error)
                    return "domainCookieMap." + error;
            }
        }
        return null;
    };

    /**
     * Creates a CookiesMap message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CookiesMap
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CookiesMap} CookiesMap
     */
    CookiesMap.fromObject = function fromObject(object) {
        if (object instanceof $root.CookiesMap)
            return object;
        let message = new $root.CookiesMap();
        if (object.createTime != null)
            if ($util.Long)
                (message.createTime = $util.Long.fromValue(object.createTime)).unsigned = false;
            else if (typeof object.createTime === "string")
                message.createTime = parseInt(object.createTime, 10);
            else if (typeof object.createTime === "number")
                message.createTime = object.createTime;
            else if (typeof object.createTime === "object")
                message.createTime = new $util.LongBits(object.createTime.low >>> 0, object.createTime.high >>> 0).toNumber();
        if (object.updateTime != null)
            if ($util.Long)
                (message.updateTime = $util.Long.fromValue(object.updateTime)).unsigned = false;
            else if (typeof object.updateTime === "string")
                message.updateTime = parseInt(object.updateTime, 10);
            else if (typeof object.updateTime === "number")
                message.updateTime = object.updateTime;
            else if (typeof object.updateTime === "object")
                message.updateTime = new $util.LongBits(object.updateTime.low >>> 0, object.updateTime.high >>> 0).toNumber();
        if (object.domainCookieMap) {
            if (typeof object.domainCookieMap !== "object")
                throw TypeError(".CookiesMap.domainCookieMap: object expected");
            message.domainCookieMap = {};
            for (let keys = Object.keys(object.domainCookieMap), i = 0; i < keys.length; ++i) {
                if (typeof object.domainCookieMap[keys[i]] !== "object")
                    throw TypeError(".CookiesMap.domainCookieMap: object expected");
                message.domainCookieMap[keys[i]] = $root.DomainCookie.fromObject(object.domainCookieMap[keys[i]]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a CookiesMap message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CookiesMap
     * @static
     * @param {CookiesMap} message CookiesMap
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CookiesMap.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.objects || options.defaults)
            object.domainCookieMap = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.createTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.createTime = options.longs === String ? "0" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.updateTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.updateTime = options.longs === String ? "0" : 0;
        }
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (typeof message.createTime === "number")
                object.createTime = options.longs === String ? String(message.createTime) : message.createTime;
            else
                object.createTime = options.longs === String ? $util.Long.prototype.toString.call(message.createTime) : options.longs === Number ? new $util.LongBits(message.createTime.low >>> 0, message.createTime.high >>> 0).toNumber() : message.createTime;
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (typeof message.updateTime === "number")
                object.updateTime = options.longs === String ? String(message.updateTime) : message.updateTime;
            else
                object.updateTime = options.longs === String ? $util.Long.prototype.toString.call(message.updateTime) : options.longs === Number ? new $util.LongBits(message.updateTime.low >>> 0, message.updateTime.high >>> 0).toNumber() : message.updateTime;
        let keys2;
        if (message.domainCookieMap && (keys2 = Object.keys(message.domainCookieMap)).length) {
            object.domainCookieMap = {};
            for (let j = 0; j < keys2.length; ++j)
                object.domainCookieMap[keys2[j]] = $root.DomainCookie.toObject(message.domainCookieMap[keys2[j]], options);
        }
        return object;
    };

    /**
     * Converts this CookiesMap to JSON.
     * @function toJSON
     * @memberof CookiesMap
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CookiesMap.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CookiesMap
     * @function getTypeUrl
     * @memberof CookiesMap
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CookiesMap.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CookiesMap";
    };

    return CookiesMap;
})();

export const LocalStorageItem = $root.LocalStorageItem = (() => {

    /**
     * Properties of a LocalStorageItem.
     * @exports ILocalStorageItem
     * @interface ILocalStorageItem
     * @property {string|null} [key] LocalStorageItem key
     * @property {string|null} [value] LocalStorageItem value
     */

    /**
     * Constructs a new LocalStorageItem.
     * @exports LocalStorageItem
     * @classdesc Represents a LocalStorageItem.
     * @implements ILocalStorageItem
     * @constructor
     * @param {ILocalStorageItem=} [properties] Properties to set
     */
    function LocalStorageItem(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LocalStorageItem key.
     * @member {string} key
     * @memberof LocalStorageItem
     * @instance
     */
    LocalStorageItem.prototype.key = "";

    /**
     * LocalStorageItem value.
     * @member {string} value
     * @memberof LocalStorageItem
     * @instance
     */
    LocalStorageItem.prototype.value = "";

    /**
     * Creates a new LocalStorageItem instance using the specified properties.
     * @function create
     * @memberof LocalStorageItem
     * @static
     * @param {ILocalStorageItem=} [properties] Properties to set
     * @returns {LocalStorageItem} LocalStorageItem instance
     */
    LocalStorageItem.create = function create(properties) {
        return new LocalStorageItem(properties);
    };

    /**
     * Encodes the specified LocalStorageItem message. Does not implicitly {@link LocalStorageItem.verify|verify} messages.
     * @function encode
     * @memberof LocalStorageItem
     * @static
     * @param {ILocalStorageItem} message LocalStorageItem message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LocalStorageItem.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && Object.hasOwnProperty.call(message, "key"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
        if (message.value != null && Object.hasOwnProperty.call(message, "value"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
        return writer;
    };

    /**
     * Encodes the specified LocalStorageItem message, length delimited. Does not implicitly {@link LocalStorageItem.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LocalStorageItem
     * @static
     * @param {ILocalStorageItem} message LocalStorageItem message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LocalStorageItem.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LocalStorageItem message from the specified reader or buffer.
     * @function decode
     * @memberof LocalStorageItem
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LocalStorageItem} LocalStorageItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LocalStorageItem.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.LocalStorageItem();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.key = reader.string();
                    break;
                }
            case 2: {
                    message.value = reader.string();
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
     * Decodes a LocalStorageItem message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LocalStorageItem
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LocalStorageItem} LocalStorageItem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LocalStorageItem.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LocalStorageItem message.
     * @function verify
     * @memberof LocalStorageItem
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LocalStorageItem.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        return null;
    };

    /**
     * Creates a LocalStorageItem message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LocalStorageItem
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LocalStorageItem} LocalStorageItem
     */
    LocalStorageItem.fromObject = function fromObject(object) {
        if (object instanceof $root.LocalStorageItem)
            return object;
        let message = new $root.LocalStorageItem();
        if (object.key != null)
            message.key = String(object.key);
        if (object.value != null)
            message.value = String(object.value);
        return message;
    };

    /**
     * Creates a plain object from a LocalStorageItem message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LocalStorageItem
     * @static
     * @param {LocalStorageItem} message LocalStorageItem
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LocalStorageItem.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.key = "";
            object.value = "";
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        return object;
    };

    /**
     * Converts this LocalStorageItem to JSON.
     * @function toJSON
     * @memberof LocalStorageItem
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LocalStorageItem.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for LocalStorageItem
     * @function getTypeUrl
     * @memberof LocalStorageItem
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    LocalStorageItem.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/LocalStorageItem";
    };

    return LocalStorageItem;
})();

export const DomainLocalStorage = $root.DomainLocalStorage = (() => {

    /**
     * Properties of a DomainLocalStorage.
     * @exports IDomainLocalStorage
     * @interface IDomainLocalStorage
     * @property {number|Long|null} [createTime] DomainLocalStorage createTime
     * @property {number|Long|null} [updateTime] DomainLocalStorage updateTime
     * @property {Array.<ILocalStorageItem>|null} [items] DomainLocalStorage items
     */

    /**
     * Constructs a new DomainLocalStorage.
     * @exports DomainLocalStorage
     * @classdesc Represents a DomainLocalStorage.
     * @implements IDomainLocalStorage
     * @constructor
     * @param {IDomainLocalStorage=} [properties] Properties to set
     */
    function DomainLocalStorage(properties) {
        this.items = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DomainLocalStorage createTime.
     * @member {number|Long} createTime
     * @memberof DomainLocalStorage
     * @instance
     */
    DomainLocalStorage.prototype.createTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DomainLocalStorage updateTime.
     * @member {number|Long} updateTime
     * @memberof DomainLocalStorage
     * @instance
     */
    DomainLocalStorage.prototype.updateTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DomainLocalStorage items.
     * @member {Array.<ILocalStorageItem>} items
     * @memberof DomainLocalStorage
     * @instance
     */
    DomainLocalStorage.prototype.items = $util.emptyArray;

    /**
     * Creates a new DomainLocalStorage instance using the specified properties.
     * @function create
     * @memberof DomainLocalStorage
     * @static
     * @param {IDomainLocalStorage=} [properties] Properties to set
     * @returns {DomainLocalStorage} DomainLocalStorage instance
     */
    DomainLocalStorage.create = function create(properties) {
        return new DomainLocalStorage(properties);
    };

    /**
     * Encodes the specified DomainLocalStorage message. Does not implicitly {@link DomainLocalStorage.verify|verify} messages.
     * @function encode
     * @memberof DomainLocalStorage
     * @static
     * @param {IDomainLocalStorage} message DomainLocalStorage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DomainLocalStorage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.createTime);
        if (message.updateTime != null && Object.hasOwnProperty.call(message, "updateTime"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.updateTime);
        if (message.items != null && message.items.length)
            for (let i = 0; i < message.items.length; ++i)
                $root.LocalStorageItem.encode(message.items[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified DomainLocalStorage message, length delimited. Does not implicitly {@link DomainLocalStorage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DomainLocalStorage
     * @static
     * @param {IDomainLocalStorage} message DomainLocalStorage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DomainLocalStorage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DomainLocalStorage message from the specified reader or buffer.
     * @function decode
     * @memberof DomainLocalStorage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DomainLocalStorage} DomainLocalStorage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DomainLocalStorage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.DomainLocalStorage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.createTime = reader.int64();
                    break;
                }
            case 2: {
                    message.updateTime = reader.int64();
                    break;
                }
            case 5: {
                    if (!(message.items && message.items.length))
                        message.items = [];
                    message.items.push($root.LocalStorageItem.decode(reader, reader.uint32()));
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
     * Decodes a DomainLocalStorage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DomainLocalStorage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DomainLocalStorage} DomainLocalStorage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DomainLocalStorage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DomainLocalStorage message.
     * @function verify
     * @memberof DomainLocalStorage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DomainLocalStorage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (!$util.isInteger(message.createTime) && !(message.createTime && $util.isInteger(message.createTime.low) && $util.isInteger(message.createTime.high)))
                return "createTime: integer|Long expected";
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (!$util.isInteger(message.updateTime) && !(message.updateTime && $util.isInteger(message.updateTime.low) && $util.isInteger(message.updateTime.high)))
                return "updateTime: integer|Long expected";
        if (message.items != null && message.hasOwnProperty("items")) {
            if (!Array.isArray(message.items))
                return "items: array expected";
            for (let i = 0; i < message.items.length; ++i) {
                let error = $root.LocalStorageItem.verify(message.items[i]);
                if (error)
                    return "items." + error;
            }
        }
        return null;
    };

    /**
     * Creates a DomainLocalStorage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DomainLocalStorage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DomainLocalStorage} DomainLocalStorage
     */
    DomainLocalStorage.fromObject = function fromObject(object) {
        if (object instanceof $root.DomainLocalStorage)
            return object;
        let message = new $root.DomainLocalStorage();
        if (object.createTime != null)
            if ($util.Long)
                (message.createTime = $util.Long.fromValue(object.createTime)).unsigned = false;
            else if (typeof object.createTime === "string")
                message.createTime = parseInt(object.createTime, 10);
            else if (typeof object.createTime === "number")
                message.createTime = object.createTime;
            else if (typeof object.createTime === "object")
                message.createTime = new $util.LongBits(object.createTime.low >>> 0, object.createTime.high >>> 0).toNumber();
        if (object.updateTime != null)
            if ($util.Long)
                (message.updateTime = $util.Long.fromValue(object.updateTime)).unsigned = false;
            else if (typeof object.updateTime === "string")
                message.updateTime = parseInt(object.updateTime, 10);
            else if (typeof object.updateTime === "number")
                message.updateTime = object.updateTime;
            else if (typeof object.updateTime === "object")
                message.updateTime = new $util.LongBits(object.updateTime.low >>> 0, object.updateTime.high >>> 0).toNumber();
        if (object.items) {
            if (!Array.isArray(object.items))
                throw TypeError(".DomainLocalStorage.items: array expected");
            message.items = [];
            for (let i = 0; i < object.items.length; ++i) {
                if (typeof object.items[i] !== "object")
                    throw TypeError(".DomainLocalStorage.items: object expected");
                message.items[i] = $root.LocalStorageItem.fromObject(object.items[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a DomainLocalStorage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DomainLocalStorage
     * @static
     * @param {DomainLocalStorage} message DomainLocalStorage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DomainLocalStorage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.items = [];
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.createTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.createTime = options.longs === String ? "0" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.updateTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.updateTime = options.longs === String ? "0" : 0;
        }
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (typeof message.createTime === "number")
                object.createTime = options.longs === String ? String(message.createTime) : message.createTime;
            else
                object.createTime = options.longs === String ? $util.Long.prototype.toString.call(message.createTime) : options.longs === Number ? new $util.LongBits(message.createTime.low >>> 0, message.createTime.high >>> 0).toNumber() : message.createTime;
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (typeof message.updateTime === "number")
                object.updateTime = options.longs === String ? String(message.updateTime) : message.updateTime;
            else
                object.updateTime = options.longs === String ? $util.Long.prototype.toString.call(message.updateTime) : options.longs === Number ? new $util.LongBits(message.updateTime.low >>> 0, message.updateTime.high >>> 0).toNumber() : message.updateTime;
        if (message.items && message.items.length) {
            object.items = [];
            for (let j = 0; j < message.items.length; ++j)
                object.items[j] = $root.LocalStorageItem.toObject(message.items[j], options);
        }
        return object;
    };

    /**
     * Converts this DomainLocalStorage to JSON.
     * @function toJSON
     * @memberof DomainLocalStorage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DomainLocalStorage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for DomainLocalStorage
     * @function getTypeUrl
     * @memberof DomainLocalStorage
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    DomainLocalStorage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/DomainLocalStorage";
    };

    return DomainLocalStorage;
})();

export const LocalStorageMap = $root.LocalStorageMap = (() => {

    /**
     * Properties of a LocalStorageMap.
     * @exports ILocalStorageMap
     * @interface ILocalStorageMap
     * @property {number|Long|null} [createTime] LocalStorageMap createTime
     * @property {number|Long|null} [updateTime] LocalStorageMap updateTime
     * @property {Object.<string,IDomainLocalStorage>|null} [domainLocalStorageMap] LocalStorageMap domainLocalStorageMap
     */

    /**
     * Constructs a new LocalStorageMap.
     * @exports LocalStorageMap
     * @classdesc Represents a LocalStorageMap.
     * @implements ILocalStorageMap
     * @constructor
     * @param {ILocalStorageMap=} [properties] Properties to set
     */
    function LocalStorageMap(properties) {
        this.domainLocalStorageMap = {};
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LocalStorageMap createTime.
     * @member {number|Long} createTime
     * @memberof LocalStorageMap
     * @instance
     */
    LocalStorageMap.prototype.createTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * LocalStorageMap updateTime.
     * @member {number|Long} updateTime
     * @memberof LocalStorageMap
     * @instance
     */
    LocalStorageMap.prototype.updateTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * LocalStorageMap domainLocalStorageMap.
     * @member {Object.<string,IDomainLocalStorage>} domainLocalStorageMap
     * @memberof LocalStorageMap
     * @instance
     */
    LocalStorageMap.prototype.domainLocalStorageMap = $util.emptyObject;

    /**
     * Creates a new LocalStorageMap instance using the specified properties.
     * @function create
     * @memberof LocalStorageMap
     * @static
     * @param {ILocalStorageMap=} [properties] Properties to set
     * @returns {LocalStorageMap} LocalStorageMap instance
     */
    LocalStorageMap.create = function create(properties) {
        return new LocalStorageMap(properties);
    };

    /**
     * Encodes the specified LocalStorageMap message. Does not implicitly {@link LocalStorageMap.verify|verify} messages.
     * @function encode
     * @memberof LocalStorageMap
     * @static
     * @param {ILocalStorageMap} message LocalStorageMap message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LocalStorageMap.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.createTime);
        if (message.updateTime != null && Object.hasOwnProperty.call(message, "updateTime"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.updateTime);
        if (message.domainLocalStorageMap != null && Object.hasOwnProperty.call(message, "domainLocalStorageMap"))
            for (let keys = Object.keys(message.domainLocalStorageMap), i = 0; i < keys.length; ++i) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                $root.DomainLocalStorage.encode(message.domainLocalStorageMap[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
            }
        return writer;
    };

    /**
     * Encodes the specified LocalStorageMap message, length delimited. Does not implicitly {@link LocalStorageMap.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LocalStorageMap
     * @static
     * @param {ILocalStorageMap} message LocalStorageMap message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LocalStorageMap.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LocalStorageMap message from the specified reader or buffer.
     * @function decode
     * @memberof LocalStorageMap
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LocalStorageMap} LocalStorageMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LocalStorageMap.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.LocalStorageMap(), key, value;
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.createTime = reader.int64();
                    break;
                }
            case 2: {
                    message.updateTime = reader.int64();
                    break;
                }
            case 5: {
                    if (message.domainLocalStorageMap === $util.emptyObject)
                        message.domainLocalStorageMap = {};
                    let end2 = reader.uint32() + reader.pos;
                    key = "";
                    value = null;
                    while (reader.pos < end2) {
                        let tag2 = reader.uint32();
                        switch (tag2 >>> 3) {
                        case 1:
                            key = reader.string();
                            break;
                        case 2:
                            value = $root.DomainLocalStorage.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag2 & 7);
                            break;
                        }
                    }
                    message.domainLocalStorageMap[key] = value;
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
     * Decodes a LocalStorageMap message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LocalStorageMap
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LocalStorageMap} LocalStorageMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LocalStorageMap.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LocalStorageMap message.
     * @function verify
     * @memberof LocalStorageMap
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LocalStorageMap.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (!$util.isInteger(message.createTime) && !(message.createTime && $util.isInteger(message.createTime.low) && $util.isInteger(message.createTime.high)))
                return "createTime: integer|Long expected";
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (!$util.isInteger(message.updateTime) && !(message.updateTime && $util.isInteger(message.updateTime.low) && $util.isInteger(message.updateTime.high)))
                return "updateTime: integer|Long expected";
        if (message.domainLocalStorageMap != null && message.hasOwnProperty("domainLocalStorageMap")) {
            if (!$util.isObject(message.domainLocalStorageMap))
                return "domainLocalStorageMap: object expected";
            let key = Object.keys(message.domainLocalStorageMap);
            for (let i = 0; i < key.length; ++i) {
                let error = $root.DomainLocalStorage.verify(message.domainLocalStorageMap[key[i]]);
                if (error)
                    return "domainLocalStorageMap." + error;
            }
        }
        return null;
    };

    /**
     * Creates a LocalStorageMap message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LocalStorageMap
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LocalStorageMap} LocalStorageMap
     */
    LocalStorageMap.fromObject = function fromObject(object) {
        if (object instanceof $root.LocalStorageMap)
            return object;
        let message = new $root.LocalStorageMap();
        if (object.createTime != null)
            if ($util.Long)
                (message.createTime = $util.Long.fromValue(object.createTime)).unsigned = false;
            else if (typeof object.createTime === "string")
                message.createTime = parseInt(object.createTime, 10);
            else if (typeof object.createTime === "number")
                message.createTime = object.createTime;
            else if (typeof object.createTime === "object")
                message.createTime = new $util.LongBits(object.createTime.low >>> 0, object.createTime.high >>> 0).toNumber();
        if (object.updateTime != null)
            if ($util.Long)
                (message.updateTime = $util.Long.fromValue(object.updateTime)).unsigned = false;
            else if (typeof object.updateTime === "string")
                message.updateTime = parseInt(object.updateTime, 10);
            else if (typeof object.updateTime === "number")
                message.updateTime = object.updateTime;
            else if (typeof object.updateTime === "object")
                message.updateTime = new $util.LongBits(object.updateTime.low >>> 0, object.updateTime.high >>> 0).toNumber();
        if (object.domainLocalStorageMap) {
            if (typeof object.domainLocalStorageMap !== "object")
                throw TypeError(".LocalStorageMap.domainLocalStorageMap: object expected");
            message.domainLocalStorageMap = {};
            for (let keys = Object.keys(object.domainLocalStorageMap), i = 0; i < keys.length; ++i) {
                if (typeof object.domainLocalStorageMap[keys[i]] !== "object")
                    throw TypeError(".LocalStorageMap.domainLocalStorageMap: object expected");
                message.domainLocalStorageMap[keys[i]] = $root.DomainLocalStorage.fromObject(object.domainLocalStorageMap[keys[i]]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a LocalStorageMap message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LocalStorageMap
     * @static
     * @param {LocalStorageMap} message LocalStorageMap
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LocalStorageMap.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.objects || options.defaults)
            object.domainLocalStorageMap = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.createTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.createTime = options.longs === String ? "0" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.updateTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.updateTime = options.longs === String ? "0" : 0;
        }
        if (message.createTime != null && message.hasOwnProperty("createTime"))
            if (typeof message.createTime === "number")
                object.createTime = options.longs === String ? String(message.createTime) : message.createTime;
            else
                object.createTime = options.longs === String ? $util.Long.prototype.toString.call(message.createTime) : options.longs === Number ? new $util.LongBits(message.createTime.low >>> 0, message.createTime.high >>> 0).toNumber() : message.createTime;
        if (message.updateTime != null && message.hasOwnProperty("updateTime"))
            if (typeof message.updateTime === "number")
                object.updateTime = options.longs === String ? String(message.updateTime) : message.updateTime;
            else
                object.updateTime = options.longs === String ? $util.Long.prototype.toString.call(message.updateTime) : options.longs === Number ? new $util.LongBits(message.updateTime.low >>> 0, message.updateTime.high >>> 0).toNumber() : message.updateTime;
        let keys2;
        if (message.domainLocalStorageMap && (keys2 = Object.keys(message.domainLocalStorageMap)).length) {
            object.domainLocalStorageMap = {};
            for (let j = 0; j < keys2.length; ++j)
                object.domainLocalStorageMap[keys2[j]] = $root.DomainLocalStorage.toObject(message.domainLocalStorageMap[keys2[j]], options);
        }
        return object;
    };

    /**
     * Converts this LocalStorageMap to JSON.
     * @function toJSON
     * @memberof LocalStorageMap
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LocalStorageMap.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for LocalStorageMap
     * @function getTypeUrl
     * @memberof LocalStorageMap
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    LocalStorageMap.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/LocalStorageMap";
    };

    return LocalStorageMap;
})();

export { $root as default };
