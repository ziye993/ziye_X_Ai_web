const apiEndpoint = "http://www.ziye993.cn:8080/xai"; // 替换为实际的 API 端点
const apiKey = "xai-EAKTZcMC9wPG6sZKbcsezRBlT6rme8AcC1WHp96ZqG50rL14ObIgfAL2Bl9ypx8u1Dz7B3zYk76HdN4P"; // 替换为实际的 API 密钥

const endStr = "[DONE]";

// const defaultsystemMessageConfig = JSON.parse(localStorage.getItem("config") || "{}");
// const defaultsystemMessage = defaultsystemMessageConfig.aifix || "";
// const defaultConfigMessage = [];
async function readStreamAndDisplay(
    stream: ReadableStream,
    updateCallback: (chunk: string, end?: boolean) => void
): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let lasttxt = "";
    while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
            const text = lasttxt + decoder.decode(value, { stream: !done });

            text.split("\n\n").forEach((line) => {
                if (line.startsWith("data: ")) {
                    const chunk = line.replace("data: ", "");
                    // console.log(chunk, 'line', JSON.parse(chunk))
                    if (chunk === endStr) {
                        updateCallback("", true)
                        return;
                    }
                    let parsedData;
                    let message = "";
                    try {
                        parsedData = JSON.parse(chunk);
                        message = parsedData?.choices?.[0].delta.content;

                        lasttxt = "";
                        updateCallback(message);
                        console.log(message)
                    } catch (err) {
                        lasttxt = line;
                        console.log(err)
                    }
                } else {
                    lasttxt = line;
                }
            });

        }
    }
}

export default async function chunkText(data: { messages: { role: string, content: string }[], id: string }, updateCallback: (chunk: string, end?: boolean) => void) {
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // "messages": [...defaultConfigMessage, ...messages],
            "messages": data.messages,
            "model": "grok-beta",
            "stream": true,
            "temperature": 0,
            messageId: data.id,
        }),
    });
    if (response.body) {
        await readStreamAndDisplay(response.body, updateCallback);
    }
} 