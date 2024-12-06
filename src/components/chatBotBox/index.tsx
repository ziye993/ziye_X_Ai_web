import React, { memo, useState } from "react";
import { marked } from 'marked';
import './index.css'
import 'highlight.js/styles/github.css'; // 选择一个样式
import { ICachItem, IListItem } from "../../App";
import chunkText from "./stream";

interface IProps {
  cacheMessages: IListItem;
  saveChat: (id: string, cach: ICachItem[]) => void;
}

function ChatBot(props: IProps) {
  // const [messages, setMessages] = useState<{ role: string; content: string }[]>(props?.cacheMessages?.cach || []);
  const [inputDisable, setDisable] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState('')
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const originCach = [...props.cacheMessages.cach];
    setDisable(true);
    props.saveChat(props.cacheMessages?.id, [...props.cacheMessages.cach, { role: "user", content: input }]);

    try {
      let messages = "";
      await chunkText([
        ...(originCach || []),
        {
          "role": "user",
          "content": input
        }
      ], (text, end) => {
        if (text) {
          messages += text;
          setCurrentText((prev) => {
            return prev + text
          });
        }
        if (end) {
          props.saveChat(props.cacheMessages?.id, [...originCach, { role: "user", content: input }, { role: "assistant", content: messages }]);
          setCurrentText('');
          setInput("")
        }
      })

    } catch (error) {
      console.error("Error", error);
      props.saveChat(props.cacheMessages?.id, [...originCach]);
    }
    setDisable(false)
  };

  return (
    <div className="container" >
      <h1>X.AI</h1>
      <div className="chatBox" >
        {props?.cacheMessages?.cach?.map((msg, index) => (
          <div key={index}
            className="chatItem"
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "unset",
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
        {inputDisable && currentText && (
          <div className="chatItem"
            style={{
              alignSelf: "flex-start",
              alignItems: "flex-start",
            }}>
            <strong>assistant</strong>
            <div
              className="message"
              style={{
                backgroundColor: "#eeeeee",
              }}>
              <div dangerouslySetInnerHTML={{ __html: marked(currentText) }} />
            </div>
          </div>
        )}
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


export default memo(ChatBot);