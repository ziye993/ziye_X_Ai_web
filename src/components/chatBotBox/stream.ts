

const apiEndpoint = "https://api.x.ai/v1/chat/completions"; // 替换为实际的 API 端点
const apiKey = "xai-EAKTZcMC9wPG6sZKbcsezRBlT6rme8AcC1WHp96ZqG50rL14ObIgfAL2Bl9ypx8u1Dz7B3zYk76HdN4P"; // 替换为实际的 API 密钥

const endStr = "data: [DONE]"

async function readStreamAndDisplay(
    stream: ReadableStream,
    updateCallback: (chunk: any) => void
): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
        // const { value, done: streamDone } = await reader.read();
        const data = await reader.read();
        console.log(data,'data')
        // done = streamDone;
        // if (value) {
        //     const text = decoder.decode(value, { stream: !done });
        //     const json = text.slice(6)
        //     if (endStr === json) {
        //         done === true
        //         updateCallback(null);
        //         return
        //     } else {
        //         console.log("json:",json)
        //         updateCallback(JSON.parse(json));
        //     }

        // }
    }
}

export default async function chunkText(messages: any, updateCallback: (chunk: any) => void) {
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "messages": messages,
            "model": "grok-beta",
            "stream": true,
            "temperature": 0
        }),
    });
    if (response.body) {
        await readStreamAndDisplay(response.body, updateCallback);
    }
} 