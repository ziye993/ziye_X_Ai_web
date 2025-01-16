const apiEndpoint = "http://www.ziye993.cn:8080/"; // 替换为实际的 API 端点

const newGetFetch = async (path: string) => {
    return fetch(apiEndpoint + path, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const getOnlineStatus = async () => {
    const res = await newGetFetch("isOnline");
    return res.json();
}

export const postRestartVpn = async () => {
    const res = await newGetFetch("restartVpn");
    return res.json();
}

