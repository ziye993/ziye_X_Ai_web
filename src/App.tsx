import { useRef, useState } from 'react'
import './App.css'
import ChatBot from './components/chatBotBox'
import ChatTool from './components/chatTool'
import ChatList from './components/ChatList';
import ConfigBox from './components/configBox';

export interface ICachItem {
  role: string;
  content: string;
}

export interface IListItem {
  id: string;
  selected: boolean;
  cach: ICachItem[];
}


const defaultMessageObj: IListItem[] = [];
const cacheMessagesJson = JSON.parse(localStorage.getItem("cacheMessages") || "[]");

const cacheMessages = cacheMessagesJson.length ? cacheMessagesJson : [{ id: Math.random() + "", cach: defaultMessageObj, selected: true }];
const after = cacheMessages.find((item: IListItem) => item.selected === true);
console.log(cacheMessages)
function App() {
  const [list, setList] = useState<IListItem[]>(cacheMessages || [{}])
  const [current, setCurrent] = useState(after > -1 ? after : 0);
  const chatRef = useRef(null);
  const saveChat = (id: string, cach: ICachItem[]) => {
    setList((prev) => {
      const index = prev.findIndex((item: IListItem) => item.id === id);
      if (index !== -1) {
        const newList = [...prev];
        newList[index] = {
          ...newList[index],
          selected: true,
          cach
        };
        localStorage.setItem("cacheMessages", JSON.stringify(newList));
        return newList;
      }
      return prev;
    });
  }

  const clearChat = (pid?: string) => {
    const id = pid || list?.[current]?.id;
    if (!id) {
      return
    }
    setList((prev) => {
      const newList = prev.filter((item: IListItem) => item.id !== id);
      if (newList.length === 0) {
        newList.push({ id: Math.random() + "", cach: defaultMessageObj, selected: true })
      }
      localStorage.setItem("cacheMessages", JSON.stringify(newList));
      return newList
    });
    setCurrent(0);
  }

  const newChat = () => {
    const newId = Math.random() + "";
    setList((prev) => {
      const newList = [...prev, { id: newId, cach: defaultMessageObj, selected: true }];
      localStorage.setItem("cacheMessages", JSON.stringify(newList));
      return newList
    });
    setCurrent(list.length);
  }

  const clearAllChat = () => {
    setList(() => {
      const newList = [{ id: Math.random() + "", cach: [], selected: true }];
      localStorage.setItem("cacheMessages", JSON.stringify([{ id: Math.random(), cach: defaultMessageObj, selected: true }]));
      return newList
    });
  }

  const setConfig = () => {
    window?.showConfigBox?.();

  }

  return (
    <>
      <ChatBot cacheMessages={list[current]} saveChat={saveChat} ref={chatRef} />
      <ChatList current={current} list={list} setCurrent={setCurrent} clearChat={clearChat} />
      <ChatTool clearChat={clearChat} newChat={newChat} setConfig={setConfig} clearAllChat={clearAllChat} />
      <ConfigBox />
    </>
  )
}

export default App
