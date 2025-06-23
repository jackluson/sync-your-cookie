
## How to use
`Sync-Your-Cookie` uses Cloudflare [KV](https://developers.cloudflare.com/kv/) to store cookie data. Here is a tutorial on how to configure KV and Token:

## Create Namespace

![create_namespace](./screenshots/kv//create_namepace.png)

Input
![created_namespace](./screenshots/kv/input_name.png)

Your NamespaceId
![namespaceId](./screenshots/kv/namespaceId.png)

## Your AccountId

![your_account_id](./screenshots/kv//account-id.png)

## Create Token

1. Enter Profile Page

![token_page](./screenshots/kv//create_token.png)

2. Custom Permission

![setting-up](./screenshots/kv//custom_token.png)

3. Select KV Read and Write Permission

![select-permission](./screenshots/kv/setting-permission.png)

4. Confirm Create

![confirm-create](./screenshots/kv/finish_create_token.png)

5. Copy Token

![copy-token](./screenshots/kv/copy_token.png)

6. Your Token List

![your-token-list](./screenshots/kv/created_token_list.png)

7. Paste Your Account Info And Save

![paste-and-save](./screenshots/kv/paste.png)

8. Push Your Cookie

![push-cookie](./screenshots/kv/push_cookie.png)

9. Check Your Cookie

The uploaded cookie is a protobuf-encoded string
![check your cookie](./screenshots/kv/reload_page.png)

