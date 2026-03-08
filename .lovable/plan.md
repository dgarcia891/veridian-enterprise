

## Fix: Retell Chat Demo Failing on Sunset on Lyons Page

### Root Cause
The Retell AI API has updated its endpoints. The edge functions are using deprecated `/v2/` URLs that now return 404:
- `POST /v2/create-chat` → now `POST /create-chat`
- `POST /v2/send-chat-message/{chatId}` → now `POST /create-chat-completion` (with `chat_id` in body)

### Changes Required

**1. Update `supabase/functions/create-retell-chat/index.ts`**
- Change URL from `https://api.retellai.com/v2/create-chat` to `https://api.retellai.com/create-chat`

**2. Update `supabase/functions/send-chat-message/index.ts`**
- Change URL from `https://api.retellai.com/v2/send-chat-message/${chatId}` to `https://api.retellai.com/create-chat-completion`
- Move `chatId` into the request body as `chat_id`
- Update the body payload: send `{ chat_id: chatId, content }` instead of `{ content, role: 'user' }`

**3. Update `supabase/functions/create-retell-call/index.ts`**
- Change URL from `https://api.retellai.com/v2/create-web-call` to `https://api.retellai.com/create-web-call` (same pattern fix)

**4. Update `src/hooks/useRetellChat.ts`**
- Update the response handling in `sendMessage` to match the new `create-chat-completion` response format (the response returns `{ messages: [...] }` which already matches the current parsing logic, so this should work as-is)

