import * as $protobuf from "protobufjs";
import Long = require("long");
/** Properties of a Cookie. */
export interface ICookie {

    /** Cookie domain */
    domain?: (string|null);

    /** Cookie name */
    name?: (string|null);

    /** Cookie storeId */
    storeId?: (string|null);

    /** Cookie value */
    value?: (string|null);

    /** Cookie session */
    session?: (boolean|null);

    /** Cookie hostOnly */
    hostOnly?: (boolean|null);

    /** Cookie expirationDate */
    expirationDate?: (number|null);

    /** Cookie path */
    path?: (string|null);

    /** Cookie httpOnly */
    httpOnly?: (boolean|null);

    /** Cookie secure */
    secure?: (boolean|null);

    /** Cookie sameSite */
    sameSite?: (string|null);
}

/** Represents a Cookie. */
export class Cookie implements ICookie {

    /**
     * Constructs a new Cookie.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICookie);

    /** Cookie domain. */
    public domain: string;

    /** Cookie name. */
    public name: string;

    /** Cookie storeId. */
    public storeId: string;

    /** Cookie value. */
    public value: string;

    /** Cookie session. */
    public session: boolean;

    /** Cookie hostOnly. */
    public hostOnly: boolean;

    /** Cookie expirationDate. */
    public expirationDate: number;

    /** Cookie path. */
    public path: string;

    /** Cookie httpOnly. */
    public httpOnly: boolean;

    /** Cookie secure. */
    public secure: boolean;

    /** Cookie sameSite. */
    public sameSite: string;

    /**
     * Creates a new Cookie instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Cookie instance
     */
    public static create(properties?: ICookie): Cookie;

    /**
     * Encodes the specified Cookie message. Does not implicitly {@link Cookie.verify|verify} messages.
     * @param message Cookie message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICookie, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Cookie message, length delimited. Does not implicitly {@link Cookie.verify|verify} messages.
     * @param message Cookie message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICookie, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Cookie message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Cookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Cookie;

    /**
     * Decodes a Cookie message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Cookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Cookie;

    /**
     * Verifies a Cookie message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Cookie message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Cookie
     */
    public static fromObject(object: { [k: string]: any }): Cookie;

    /**
     * Creates a plain object from a Cookie message. Also converts values to other types if specified.
     * @param message Cookie
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Cookie, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Cookie to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Cookie
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a DomainCookie. */
export interface IDomainCookie {

    /** DomainCookie createTime */
    createTime?: (number|Long|null);

    /** DomainCookie updateTime */
    updateTime?: (number|Long|null);

    /** DomainCookie cookies */
    cookies?: (ICookie[]|null);
}

/** Represents a DomainCookie. */
export class DomainCookie implements IDomainCookie {

    /**
     * Constructs a new DomainCookie.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDomainCookie);

    /** DomainCookie createTime. */
    public createTime: (number|Long);

    /** DomainCookie updateTime. */
    public updateTime: (number|Long);

    /** DomainCookie cookies. */
    public cookies: ICookie[];

    /**
     * Creates a new DomainCookie instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DomainCookie instance
     */
    public static create(properties?: IDomainCookie): DomainCookie;

    /**
     * Encodes the specified DomainCookie message. Does not implicitly {@link DomainCookie.verify|verify} messages.
     * @param message DomainCookie message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDomainCookie, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DomainCookie message, length delimited. Does not implicitly {@link DomainCookie.verify|verify} messages.
     * @param message DomainCookie message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDomainCookie, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DomainCookie message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DomainCookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DomainCookie;

    /**
     * Decodes a DomainCookie message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DomainCookie
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DomainCookie;

    /**
     * Verifies a DomainCookie message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DomainCookie message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DomainCookie
     */
    public static fromObject(object: { [k: string]: any }): DomainCookie;

    /**
     * Creates a plain object from a DomainCookie message. Also converts values to other types if specified.
     * @param message DomainCookie
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DomainCookie, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DomainCookie to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DomainCookie
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Properties of a CookiesMap. */
export interface ICookiesMap {

    /** CookiesMap createTime */
    createTime?: (number|Long|null);

    /** CookiesMap updateTime */
    updateTime?: (number|Long|null);

    /** CookiesMap domainCookieMap */
    domainCookieMap?: ({ [k: string]: IDomainCookie }|null);
}

/** Represents a CookiesMap. */
export class CookiesMap implements ICookiesMap {

    /**
     * Constructs a new CookiesMap.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICookiesMap);

    /** CookiesMap createTime. */
    public createTime: (number|Long);

    /** CookiesMap updateTime. */
    public updateTime: (number|Long);

    /** CookiesMap domainCookieMap. */
    public domainCookieMap: { [k: string]: IDomainCookie };

    /**
     * Creates a new CookiesMap instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CookiesMap instance
     */
    public static create(properties?: ICookiesMap): CookiesMap;

    /**
     * Encodes the specified CookiesMap message. Does not implicitly {@link CookiesMap.verify|verify} messages.
     * @param message CookiesMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICookiesMap, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CookiesMap message, length delimited. Does not implicitly {@link CookiesMap.verify|verify} messages.
     * @param message CookiesMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICookiesMap, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CookiesMap message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CookiesMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CookiesMap;

    /**
     * Decodes a CookiesMap message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CookiesMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CookiesMap;

    /**
     * Verifies a CookiesMap message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CookiesMap message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CookiesMap
     */
    public static fromObject(object: { [k: string]: any }): CookiesMap;

    /**
     * Creates a plain object from a CookiesMap message. Also converts values to other types if specified.
     * @param message CookiesMap
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CookiesMap, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CookiesMap to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CookiesMap
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}
