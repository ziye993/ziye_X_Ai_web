import React, { forwardRef, useState } from "react";
import { marked } from 'marked';
import axios from "axios";
import './index.css'
import 'highlight.js/styles/github.css'; // 选择一个样式
import { ICachItem, IListItem } from "../../App";

interface IProps {
  cacheMessages: IListItem;
  saveChat: (id: string, cach: ICachItem[]) => void;
}

const apiEndpoint = "https://api.x.ai/v1/chat/completions"; // 替换为实际的 API 端点
const apiKey = "xai-EAKTZcMC9wPG6sZKbcsezRBlT6rme8AcC1WHp96ZqG50rL14ObIgfAL2Bl9ypx8u1Dz7B3zYk76HdN4P"; // 替换为实际的 API 密钥

function ChatBot(props: IProps) {
  // const [messages, setMessages] = useState<{ role: string; content: string }[]>(props?.cacheMessages?.cach || []);
  const [inputDisable, setDisable] = useState<boolean>(false)
  const [input, setInput] = useState("");
  const sendMessage = async () => {
    if (!input.trim()) return;
    setDisable(true);
    // props.saveChat(props.cacheMessages?.id, [...props.cacheMessages.cach, { role: "user", content: input }])
    try {
      // 调用 X.AI API
      const response = await axios.post(
        apiEndpoint,
        {
          "messages": [
            ...(props?.cacheMessages?.cach || []),
            {
              "role": "user",
              "content": input
            }
          ],
          "model": "grok-beta",
          "stream": false,
          "temperature": 0
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      const aiMessage = response?.data?.choices?.[0]?.message?.content;
      // 添加 AI 的回复到界面
      if (aiMessage) {
        props.saveChat(props.cacheMessages?.id, [...props.cacheMessages.cach, { role: "user", content: input }, { role: "system", content: aiMessage }])
      } else {
        throw Error("未找到消息，请查看返回值对象路径")
      }
    } catch (error) {
      console.error("Error communicating with X.AI API:", error);
    }
    setDisable(false)
    setInput(""); // 清空输入框
  };



  return (
    <div className="container" >
      <h1>X.AI</h1>
      <div className="chatBox" >
        {props?.cacheMessages?.cach?.map((msg, index) => (
          <div key={index}
            className="chatItem"
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}>
            <strong>{msg.role}</strong>
            <div
              className="message"
              style={{
                backgroundColor: msg.role === "user" ? "#DCF8C6" : "#eeeeee",
              }}>
              {msg.content && (msg.role === "user" ? msg.content : <div dangerouslySetInnerHTML={{ __html: marked(msg.content) }} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="inputContainer">
        <input
          className="input"
          type="text"
          value={input}
          disabled={inputDisable}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e?.key === 'Enter') {
              // 执行事件
              sendMessage();
            }
          }}
          placeholder="enter your message ..."
        />
        <button onClick={sendMessage} className="button" disabled={inputDisable} >
          Send
        </button>

      </div>
    </div>
  );
};


export default forwardRef(ChatBot);