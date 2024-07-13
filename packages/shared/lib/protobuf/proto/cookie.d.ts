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

/** Properties of a DomainCookies. */
export interface IDomainCookies {

    /** DomainCookies timestamp */
    timestamp?: (number|Long|null);

    /** DomainCookies cookies */
    cookies?: (ICookie[]|null);
}

/** Represents a DomainCookies. */
export class DomainCookies implements IDomainCookies {

    /**
     * Constructs a new DomainCookies.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDomainCookies);

    /** DomainCookies timestamp. */
    public timestamp: (number|Long);

    /** DomainCookies cookies. */
    public cookies: ICookie[];

    /**
     * Creates a new DomainCookies instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DomainCookies instance
     */
    public static create(properties?: IDomainCookies): DomainCookies;

    /**
     * Encodes the specified DomainCookies message. Does not implicitly {@link DomainCookies.verify|verify} messages.
     * @param message DomainCookies message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDomainCookies, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified DomainCookies message, length delimited. Does not implicitly {@link DomainCookies.verify|verify} messages.
     * @param message DomainCookies message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDomainCookies, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DomainCookies message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DomainCookies
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): DomainCookies;

    /**
     * Decodes a DomainCookies message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DomainCookies
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): DomainCookies;

    /**
     * Verifies a DomainCookies message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DomainCookies message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DomainCookies
     */
    public static fromObject(object: { [k: string]: any }): DomainCookies;

    /**
     * Creates a plain object from a DomainCookies message. Also converts values to other types if specified.
     * @param message DomainCookies
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DomainCookies, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DomainCookies to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for DomainCookies
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}
